import { useEffect, useState } from "react";

// 画面幅とタッチ操作を判定（スマホでは3Dのドラッグ操作を切ってスクロールを優先）
export const useMediaQuery = (query) => {
  const get = () => typeof window !== "undefined" && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export const useIsMobile = () => useMediaQuery("(max-width: 500px)");
export const useIsTouch = () => useMediaQuery("(hover: none) and (pointer: coarse)");
