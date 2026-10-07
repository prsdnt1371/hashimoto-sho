import { useEffect } from "react";

import { invalidatePc, leavePc, pcCursor, usePc } from "../../pc/store";
import { useMediaQuery } from "../../hooks/useIsMobile";
import PcOS from "./PcOS";

// 3D モニターの画面にぴったり重ねる操作レイヤー
// PC：画面の位置・大きさに合わせて配置（中は 960px 幅の仮想画面を拡大縮小）
// スマホ：読みやすさ優先でヒーロー全体に広げて表示
const VIRTUAL_W = 960;

const PcOverlay = () => {
  const mode = usePc((s) => s.mode);
  const rect = usePc((s) => s.rect);
  const aspect = usePc((s) => s.aspect);
  const compact = useMediaQuery("(max-width: 639px)");

  // 画面から離れたらマウスを元の位置へ
  useEffect(() => {
    if (mode !== "focused") {
      pcCursor.inside = false;
      pcCursor.pressed = false;
      invalidatePc();
    }
  }, [mode]);

  if (mode !== "focused" || !rect) return null;

  const track = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    pcCursor.u = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    pcCursor.v = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    pcCursor.inside = e.pointerType === "mouse";
    invalidatePc();
  };
  const press = (down) => () => {
    pcCursor.pressed = down;
    invalidatePc();
  };

  if (compact) {
    return (
      <div className='pc-screen-on absolute inset-x-3 top-[84px] bottom-[76px] z-10 overflow-hidden rounded-xl ring-1 ring-line shadow-card'>
        <div className='relative h-full w-full'>
          <PcOS width={360} height={600} compact onShutdown={leavePc} />
        </div>
      </div>
    );
  }

  const scale = rect.width / VIRTUAL_W;
  const virtualH = rect.height / scale;

  return (
    <div
      className='pc-screen-on absolute z-10 overflow-hidden'
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
      onPointerMoveCapture={track}
      onPointerLeave={() => {
        pcCursor.inside = false;
        pcCursor.pressed = false;
        invalidatePc();
      }}
      onPointerDownCapture={press(true)}
      onPointerUpCapture={press(false)}
    >
      <div
        className='relative origin-top-left'
        style={{ width: VIRTUAL_W, height: virtualH, transform: `scale(${scale})` }}
        data-aspect={aspect.toFixed(3)}
      >
        <PcOS width={VIRTUAL_W} height={virtualH} scale={scale} onShutdown={leavePc} />
      </div>
    </div>
  );
};

export default PcOverlay;
