import { useSyncExternalStore } from "react";

// 3D の PC と、画面内デスクトップ（DOM）で共有する小さな状態
// mode: "idle"（通常） → "entering"（ズーム中） → "focused"（操作中） → "leaving"（戻り中）
const state = {
  mode: "idle",
  rect: null, // 画面の位置（ヒーロー内のpx）{ x, y, width, height }
  aspect: 16 / 9, // 画面の縦横比
  anchor: null, // 通常時のモニター上端の位置（ヒント表示用）
};

const listeners = new Set();

export const pcStore = {
  get: () => state,
  set(patch) {
    Object.assign(state, patch);
    listeners.forEach((l) => l());
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const usePc = (selector) =>
  useSyncExternalStore(pcStore.subscribe, () => selector(state), () => selector(state));

export const enterPc = () => {
  if (state.mode === "idle") pcStore.set({ mode: "entering" });
};
export const leavePc = () => {
  if (state.mode === "focused" || state.mode === "entering") pcStore.set({ mode: "leaving" });
};

// カーソル位置は頻繁に変わるので React の再描画を通さず直接共有
// u, v は画面内の位置（0〜1、左上が 0,0）
export const pcCursor = { u: 0.5, v: 0.5, inside: false, pressed: false };

// 3D 側の再描画（frameloop="demand" のため）
let invalidateFn = null;
export const setPcInvalidate = (fn) => {
  invalidateFn = fn;
};
export const invalidatePc = () => invalidateFn?.();
