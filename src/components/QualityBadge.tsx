import { Star, Leaf, Circle } from "lucide-react";
import type { Quality } from "@/data/mock";

const CONFIG: Record<Quality, { classes: string; Icon: typeof Star }> = {
  Premium: { classes: "bg-sun-300/50 text-yellow-800", Icon: Star },
  Primera: { classes: "bg-agro-100 text-agro-800", Icon: Leaf },
  Segunda: { classes: "bg-stone-200 text-stone-600", Icon: Circle },
};

export default function QualityBadge({ quality }: { quality: Quality }) {
  const { classes, Icon } = CONFIG[quality];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      <Icon size={12} /> {quality}
    </span>
  );
}
