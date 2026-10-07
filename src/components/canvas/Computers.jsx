import { Suspense, useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { useIsTouch } from "../../hooks/useIsMobile";
import { activeTheme } from "../../theme";
import { pcCursor, pcStore, setPcInvalidate, usePc, enterPc } from "../../pc/store";

const MODEL_URL = "/desktop_pc/scene.glb";

// 画面の縦横比に合わせてモデルの大きさと位置を調整（縦長のスマホでも机全体が入るように）
const useFit = () => {
  const { width, height } = useThree((state) => state.size);
  const aspect = width / Math.max(height, 1);
  const scale = Math.min(0.75, Math.max(0.3, 0.72 * aspect));
  const t = (scale - 0.33) / (0.75 - 0.33);
  return { scale, position: [0, -2.4 - 0.85 * t, -0.5 - 1.0 * t] };
};

// PCのRGBライト（ファン・キーボード・スピーカー・マウスパッド等）をテーマの色味に寄せる
// ・光る部分 → テーマ色の明るさだけ残して着色
// ・色付きの部分 → 彩度の高いところだけ着色（グレーの部分はそのまま）
const KEEP_ORIGINAL = new Set(["Material.074_30"]); // モニター画面
const ALSO_TINT = new Set(["Material.074_21", "Material.073"]); // マウスパッド等（発光なし）
const LUMA = "vec3(0.2126, 0.7152, 0.0722)";

const useThemedGlow = (scene, glow) => {
  useMemo(() => {
    if (!glow) return;
    const tint = new Color(glow);
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m || m.userData.themedGlow || KEEP_ORIGINAL.has(m.name)) return;
        const glows = m.emissiveMap || (m.emissive && m.emissive.getHex() !== 0);
        if (!glows && !ALSO_TINT.has(m.name)) return;
        m.userData.themedGlow = true;
        m.onBeforeCompile = (shader) => {
          shader.uniforms.uGlowTint = { value: tint };
          shader.fragmentShader =
            "uniform vec3 uGlowTint;\n" +
            shader.fragmentShader
              .replace(
                "#include <map_fragment>",
                `#include <map_fragment>
                {
                  vec3 c = diffuseColor.rgb;
                  float l = dot(c, ${LUMA});
                  float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
                  diffuseColor.rgb = mix(vec3(l), uGlowTint * l * 1.8, clamp(sat * 2.5, 0.0, 1.0));
                }`
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
                totalEmissiveRadiance = uGlowTint * dot(totalEmissiveRadiance, ${LUMA}) * 1.6;`
              );
        };
        m.needsUpdate = true;
      });
    });
  }, [scene, glow]);
};

// ---------- 画面（モニター）の位置と向き ----------
// モデル空間では 上 = +Y、画面の左 = +Z、モニターは +X 方向を向いている
const getScreenFrame = (model, screen) => {
  model.updateMatrixWorld(true);
  const pos = screen.geometry.attributes.position;
  const local = [];
  for (let i = 0; i < pos.count; i++) {
    local.push(new Vector3().fromBufferAttribute(pos, i).applyMatrix4(screen.matrix));
  }
  local.sort((a, b) => b.y - a.y);
  const [t1, t2, b1, b2] = local;
  const [tl, tr] = t1.z > t2.z ? [t1, t2] : [t2, t1];
  const [bl, br] = b1.z > b2.z ? [b1, b2] : [b2, b1];
  const w = (v) => v.clone().applyMatrix4(model.matrixWorld);
  const c = { tl: w(tl), tr: w(tr), bl: w(bl), br: w(br) };

  const center = new Vector3().add(c.tl).add(c.tr).add(c.bl).add(c.br).multiplyScalar(0.25);
  const right = new Vector3().subVectors(c.tr, c.tl).add(new Vector3().subVectors(c.br, c.bl)).multiplyScalar(0.5);
  const up = new Vector3().subVectors(c.tl, c.bl).add(new Vector3().subVectors(c.tr, c.br)).multiplyScalar(0.5);
  const width = right.length();
  const height = up.length();
  right.normalize();
  up.normalize();
  const normal = new Vector3().crossVectors(right, up).normalize();
  up.crossVectors(normal, right).normalize();
  return { corners: c, center, right, up, normal, width, height };
};

// 画面を正面から見るカメラ位置（PC：画面を上寄せして机のマウスも見えるように）
const NAV_PX = 92;
const getFocusPose = (frame, camera, size, compact) => {
  const tanH = Math.tan(MathUtils.degToRad(camera.fov / 2));
  const aspect = size.width / size.height;
  const fH = compact ? 0.32 : 0.56; // 画面の高さ（ビューポートに対する割合）
  const maxW = compact ? 0.92 : 0.86;
  const d = Math.max(frame.height / (2 * fH * tanH), frame.width / (2 * maxW * aspect * tanH));
  const viewH = 2 * d * tanH;
  const halfNdc = frame.height / viewH;
  const topNdc = 1 - (NAV_PX / size.height) * 2;
  const cy = compact ? 0.05 : Math.max(0, topNdc - halfNdc);
  const shift = (cy * viewH) / 2;

  const position = frame.center.clone().addScaledVector(frame.normal, d).addScaledVector(frame.up, -shift);
  const target = position.clone().sub(frame.normal);
  const quaternion = new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(position, target, frame.up));
  return { position, quaternion };
};

// そのカメラ位置から見たときの画面の矩形（px）
const projectRect = (frame, camera, pose, size) => {
  const cam = camera.clone();
  cam.position.copy(pose.position);
  cam.quaternion.copy(pose.quaternion);
  cam.updateMatrixWorld(true);
  const pts = Object.values(frame.corners).map((v) => {
    const p = v.clone().project(cam);
    return { x: ((p.x + 1) / 2) * size.width, y: ((1 - p.y) / 2) * size.height };
  });
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// クリックで画面へズーム／戻る
const CameraRig = ({ model, screen }) => {
  const { camera, size, invalidate } = useThree();
  const mode = usePc((s) => s.mode);
  const anim = useRef(null);
  const returnPose = useRef(null);
  const compact = size.width < 640;

  useEffect(() => {
    if (!screen) return;
    if (mode === "entering") {
      const from = { position: camera.position.clone(), quaternion: camera.quaternion.clone() };
      returnPose.current = from;
      const frame = getScreenFrame(model, screen);
      const to = getFocusPose(frame, camera, size, compact);
      anim.current = {
        from, to, t: 0, dur: 1.2,
        done: () =>
          pcStore.set({ mode: "focused", rect: projectRect(frame, camera, to, size), aspect: frame.width / frame.height }),
      };
      invalidate();
    } else if (mode === "leaving") {
      const from = { position: camera.position.clone(), quaternion: camera.quaternion.clone() };
      const to = returnPose.current ?? {
        position: new Vector3(20, 3, 5),
        quaternion: new Quaternion().setFromRotationMatrix(
          new Matrix4().lookAt(new Vector3(20, 3, 5), new Vector3(0, 0, 0), new Vector3(0, 1, 0))
        ),
      };
      anim.current = { from, to, t: 0, dur: 1.0, done: () => pcStore.set({ mode: "idle", rect: null }) };
      invalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, screen]);

  // 操作中に画面サイズが変わったら位置を合わせ直す
  useEffect(() => {
    if (!screen || pcStore.get().mode !== "focused") return;
    const frame = getScreenFrame(model, screen);
    const pose = getFocusPose(frame, camera, size, compact);
    camera.position.copy(pose.position);
    camera.quaternion.copy(pose.quaternion);
    pcStore.set({ rect: projectRect(frame, camera, pose, size) });
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);

  // 通常時はモニター上端の位置をヒントの表示位置として共有
  const lastAnchor = useRef({ x: -1, y: -1 });
  useFrame(() => {
    if (!screen || pcStore.get().mode !== "idle" || anim.current) return;
    const f = getScreenFrame(model, screen);
    const p = f.corners.tl.clone().add(f.corners.tr).multiplyScalar(0.5).project(camera);
    const x = ((p.x + 1) / 2) * size.width;
    const y = ((1 - p.y) / 2) * size.height;
    const l = lastAnchor.current;
    if (Math.abs(l.x - x) > 0.5 || Math.abs(l.y - y) > 0.5) {
      lastAnchor.current = { x, y };
      pcStore.set({ anchor: { x, y } });
    }
  });

  useFrame(() => {
    const a = anim.current;
    if (!a) return;
    // 経過時間ベース（重い端末でもコマ落ちするだけで所要時間は一定）
    const now = performance.now();
    a.start ??= now;
    a.t = Math.min(1, (now - a.start) / 1000 / a.dur);
    const k = easeInOut(a.t);
    camera.position.lerpVectors(a.from.position, a.to.position, k);
    camera.quaternion.slerpQuaternions(a.from.quaternion, a.to.quaternion, k);
    if (a.t >= 1) {
      anim.current = null;
      a.done();
    }
    invalidate();
  });

  return null;
};

// 画面内のカーソルに合わせて机の上のマウスを動かす
const MOUSE_RANGE = { x: 0.5, z: 0.6 }; // モデル空間での可動域（ズーム時に画面外へ出ない範囲）
const MouseRig = ({ mouse }) => {
  const invalidate = useThree((s) => s.invalidate);
  const target = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    if (!mouse) return;
    const base = (mouse.userData.base ??= mouse.position.clone());
    const focused = pcStore.get().mode === "focused";
    target.copy(base);
    if (focused && pcCursor.inside) {
      target.x += (pcCursor.v - 0.5) * MOUSE_RANGE.x; // 画面の下 → 手前
      // 画面の右 → -Z（マウスは画面の右寄りにあるので、右方向は控えめに）
      const du = pcCursor.u - 0.5;
      target.z -= du * MOUSE_RANGE.z * (du > 0 ? 0.6 : 1.2);
      if (pcCursor.pressed) target.y -= 0.012;
    }
    mouse.position.lerp(target, 1 - Math.exp(-Math.min(delta, 0.1) * 14));
    if (mouse.position.distanceToSquared(target) > 1e-8) invalidate();
  });

  return null;
};

const Computers = () => {
  const computer = useGLTF(MODEL_URL);
  const { scale, position } = useFit();
  const invalidate = useThree((s) => s.invalidate);
  const mode = usePc((s) => s.mode);
  useThemedGlow(computer.scene, activeTheme.modelGlow);

  const screen = useMemo(() => computer.scene.getObjectByName("Screen"), [computer.scene]);
  const mouse = useMemo(() => computer.scene.getObjectByName("Mouse"), [computer.scene]);

  const setHover = (on) => {
    document.body.style.cursor = on ? "pointer" : "";
    if (screen?.material) {
      screen.material.emissiveIntensity = on ? 1.35 : 1;
      invalidate();
    }
  };

  useEffect(() => {
    if (mode !== "idle") setHover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
        onClick={(e) => {
          e.stopPropagation();
          const hit = e.intersections[0]?.object;
          if (hit !== screen || e.delta > 6 || pcStore.get().mode !== "idle") return;
          enterPc();
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (pcStore.get().mode !== "idle") return;
          setHover(e.intersections[0]?.object === screen);
        }}
        onPointerOut={() => setHover(false)}
      />
      <CameraRig model={computer.scene} screen={screen} />
      <MouseRig mouse={mouse} />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const isTouch = useIsTouch();
  const mode = usePc((s) => s.mode);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ invalidate }) => setPcInvalidate(invalidate)}
      // タッチ端末ではドラッグ回転を無効にして縦スクロールを優先（タップは有効）
      style={isTouch ? { touchAction: "pan-y" } : undefined}
    >
      <Suspense fallback={<CanvasLoader />}>
        {!isTouch && mode === "idle" && (
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
        <Computers />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

useGLTF.preload(MODEL_URL);

export default ComputersCanvas;
