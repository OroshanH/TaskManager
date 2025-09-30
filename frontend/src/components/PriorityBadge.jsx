// Priority badge, color and icon
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
export default function PriorityBadge({ value, size = "sm", title }) {
  const level = (value || "").toLowerCase();

  const map = {
    high:   { Icon: ArrowUp,   fg: "text-redtext",     bg: "bg-redbg",     br: "border-redborder",     label: "Priority high" },
    medium: { Icon: Minus,     fg: "text-yellowtext",   bg: "bg-yellowbg",   br: "border-yellowborder",   label: "Priority medium" },
    low:    { Icon: ArrowDown, fg: "text-greentext", bg: "bg-greenbg", br: "border-greenborder", label: "Priority low" },
    default:{ Icon: Minus,     fg: "text-muted",       bg: "bg-card",        br: "border-border",      label: "Priority —" },
  };

  const { Icon, fg, bg, br, label } = map[level] ?? map.default;

  const boxSize = {
    xs: "h-6 w-6",
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-9 w-9",
  }[size] || "h-7 w-7";

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  }[size] || 14;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${bg} ${br} border ${boxSize} shadow-inner shrink-0`}
      role="img"
      aria-label={label}
      title={title || label}
    >
      <Icon size={iconSize} className={fg} />
    </span>
  );
}
