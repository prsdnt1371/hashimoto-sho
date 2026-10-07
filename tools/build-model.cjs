// ============================================================
//  3Dモデル（public/desktop_pc/scene.glb）の作り直し用スクリプト
//  ・左右のスピーカーを削除
//  ・マウスを普通の黒マウスに（穴あきシェル・ロゴ・RGB発光を除去）し、1つのノード「Mouse」にまとめる
//  ・モニター画面を「Screen」ノードとして残す
//  ・テクスチャを WebP 化・量子化して軽量化
//
//  使い方（元モデルはテンプレートの public/desktop_pc/scene.gltf）:
//    npm i -D @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 sharp
//    node tools/build-model.cjs <元の scene.gltf> public/desktop_pc/scene.glb
// ============================================================
const { NodeIO } = require("@gltf-transform/core");
const { ALL_EXTENSIONS } = require("@gltf-transform/extensions");
const F = require("@gltf-transform/functions");
const sharp = require("sharp");

const [, , input, output] = process.argv;

// mouse region in world space (from bounds inspection)
const MOUSE_BOX = { min: [0.5, 0.25, -0.56], max: [1.6, 0.56, 0.01] };
const inside = (b) =>
  [0, 1, 2].every((k) => b.min[k] >= MOUSE_BOX.min[k] - 1e-3 && b.max[k] <= MOUSE_BOX.max[k] + 1e-3);

(async () => {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ sharp });
  const doc = await io.read(input);
  const root = doc.getRoot();
  const scene = root.getDefaultScene() || root.listScenes()[0];

  // flatten first so every mesh node is directly under the scene in world space
  await doc.transform(F.flatten());

  // ---- スピーカー（左右）を削除 ----
  const SPEAKERS = new Set([
    "Cube.043_Material.012_0", "Cylinder.001_Material.028_0", "Cylinder.002_Material.029_0",
    "Cube.044_Material.012_0", "Cylinder.003_Material.031_0", "Cylinder.004_Material.030_0",
  ]);
  let removed = 0;
  scene.traverse((n) => {
    if (SPEAKERS.has(n.getName())) { n.dispose(); removed++; }
  });
  console.log("speakers removed:", removed);

  const meshNodes = [];
  scene.traverse((n) => n.getMesh() && meshNodes.push(n));

  let screenNode = null;
  const mouseParts = [];
  for (const n of meshNodes) {
    const mats = n.getMesh().listPrimitives().map((p) => p.getMaterial()?.getName());
    if (mats.includes("Material.074_30")) screenNode = n;
    else if (inside(F.getBounds(n))) mouseParts.push(n);
  }
  if (!screenNode) throw new Error("screen not found");
  console.log("mouse parts:", mouseParts.length, mouseParts.map((n) => n.getName()).join(", "));

  // pivot: center of mouse on the pad
  const bmin = [Infinity, Infinity, Infinity], bmax = [-Infinity, -Infinity, -Infinity];
  for (const n of mouseParts) {
    const b = F.getBounds(n);
    for (let k = 0; k < 3; k++) { bmin[k] = Math.min(bmin[k], b.min[k]); bmax[k] = Math.max(bmax[k], b.max[k]); }
  }
  const pivot = [(bmin[0] + bmax[0]) / 2, bmin[1], (bmin[2] + bmax[2]) / 2];
  console.log("mouse pivot", pivot.map((v) => v.toFixed(3)), "size", bmax.map((v, k) => (v - bmin[k]).toFixed(3)));

  // ---- マウスを普通の黒いマウスに（赤い柄・ロゴ・RGB発光をやめる） ----
  const mk = (name, rgb, rough) =>
    doc.createMaterial(name).setBaseColorFactor([...rgb, 1]).setRoughnessFactor(rough).setMetallicFactor(0.05).setDoubleSided(true);
  const body = mk("MouseBody", [0.025, 0.025, 0.028], 0.72);
  const dark = mk("MouseDark", [0.012, 0.012, 0.014], 0.7);
  const wheel = mk("MouseWheel", [0.11, 0.11, 0.12], 0.45);
  const MAT_MAP = {
    "Material.074_25": body, "Material.090": body, "Material.098": body, "Material.075": body,
    "Material.076": dark, "Material.025": dark, "Material.092": dark, "Material.074_6": dark,
    "Material.077": wheel, "Material.082": wheel,
  };
  // 取り除くパーツ：ロゴ、穴あき（ハニカム）のシェル、天面のロゴ台座
  const DROP = new Set(["Material.074_27", "Material.074_25", "Material.092"]);

  // build one multi-primitive mesh for the mouse, in pivot-local space
  const mouseMesh = doc.createMesh("Mouse");
  for (const n of mouseParts) {
    const prims = n.getMesh().listPrimitives();
    if (prims.some((p) => DROP.has(p.getMaterial()?.getName()))) { n.dispose(); continue; }
    const world = n.getWorldMatrix().slice();
    world[12] -= pivot[0]; world[13] -= pivot[1]; world[14] -= pivot[2];
    for (const prim of prims) {
      const p = prim.clone();
      F.transformPrimitive(p, world);
      p.setMaterial(MAT_MAP[prim.getMaterial()?.getName()] ?? dark);
      mouseMesh.addPrimitive(p);
    }
    n.dispose();
  }
  const mouseNode = doc.createNode("Mouse").setMesh(mouseMesh).setTranslation(pivot);
  scene.addChild(mouseNode);

  screenNode.setName("Screen");

  // only keep names on the nodes we need, so join() can merge everything else
  scene.traverse((n) => {
    if (n !== mouseNode && n !== screenNode) n.setName("");
  });
  root.listMeshes().forEach((m) => m !== mouseMesh && m.setName(""));

  await doc.transform(
    F.dedup(),
    F.palette({ min: 5 }),
    F.flatten(),
    F.join({ keepNamed: true }),
    F.weld(),
    F.prune(),
    F.textureCompress({ encoder: sharp, targetFormat: "webp", resize: [1024, 1024] }),
    F.quantize()
  );

  await io.write(output, doc);
  const names = [];
  doc.getRoot().getDefaultScene().traverse((n) => n.getName() && names.push(n.getName()));
  console.log("named nodes:", names.join(", "), "| meshes:", doc.getRoot().listMeshes().length);
})();
