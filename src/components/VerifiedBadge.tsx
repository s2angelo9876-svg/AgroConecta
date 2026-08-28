import { BadgeCheck } from "lucide-react";

interface Props {
  verified: boolean | null | undefined;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function VerifiedBadge({
  verified,
  size = "sm",
  showLabel = true,
}: Props) {
  if (!verified) return null;

  const iconSize = size === "sm" ? 14 : 18;
  const label = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-agro-100 px-2 py-0.5 font-bold text-agro-800 ${label}`}
      title="Agricultor verificado por AgroConecta"
    >
      <BadgeCheck size={iconSize} className="fill-agro-600 text-white" />
      {showLabel && "Verificado"}
    </span>
  );
}