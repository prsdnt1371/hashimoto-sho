// 単色SVGをテーマの色で塗るアイコン（色は className の bg-* で指定）
const MaskIcon = ({ src, className = "w-6 h-6 bg-accent" }) => (
  <span
    aria-hidden='true'
    className={`mask-icon inline-block ${className}`}
    style={{ WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")` }}
  />
);

export default MaskIcon;
