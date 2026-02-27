import { Trash2, Droplets, Zap, Wind } from "lucide-react";
import { IssueLabel } from "@/types";

const iconMap: Record<IssueLabel, React.ReactNode> = {
  WASTE: <Trash2 className="w-3.5 h-3.5" />,
  WATER: <Droplets className="w-3.5 h-3.5" />,
  ENERGY: <Zap className="w-3.5 h-3.5" />,
  POLLUTION: <Wind className="w-3.5 h-3.5" />,
};

export default function LabelIcon({ label }: { label: IssueLabel }) {
  return <>{iconMap[label]}</>;
}
