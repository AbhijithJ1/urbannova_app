import { getLabelColor } from "@/lib/utils";
import { IssueLabel } from "@/types";
import LabelIcon from "./LabelIcon";

export default function LabelBadge({ label }: { label: IssueLabel }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLabelColor(label)}`}>
      <LabelIcon label={label} />
      {label}
    </span>
  );
}
