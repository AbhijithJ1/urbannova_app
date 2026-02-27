import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { IssueStatus } from "@/types";
import { Circle, Clock, CheckCircle, ShieldAlert } from "lucide-react";

const statusIcons: Record<IssueStatus, React.ReactNode> = {
  OPEN: <Circle className="w-3 h-3" />,
  INPROGRESS: <Clock className="w-3 h-3" />,
  COMPLETED: <CheckCircle className="w-3 h-3" />,
  BLOCKED: <ShieldAlert className="w-3 h-3" />,
};

export default function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
      {statusIcons[status]}
      {getStatusLabel(status)}
    </span>
  );
}
