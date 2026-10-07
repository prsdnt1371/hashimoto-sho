import { useRef, useState } from "react";

// react-tilt の代替（依存を減らすための軽量版）
const Tilt = ({ children, className = "", max = 12 }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTransform(
      `perspective(1000px) rotateX(${(-py * max * 2).toFixed(2)}deg) rotateY(${(px * max * 2).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`
    );
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={() => setTransform("")}
      style={{ transform, transition: "transform 0.25s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );
};

export default Tilt;
