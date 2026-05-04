import { Badge } from "./ui/badge";
import { TableRow, TableCell } from "./ui/table";

export type TaskStatus = "Completed" | "Pending" | "In Review" | "Overdue";

const statusMap: Record<TaskStatus, "success" | "warning" | "danger" | "info"> = {
  Completed: "success",
  Pending: "info",
  "In Review": "warning",
  Overdue: "danger"
};

export default function TaskRow({
  title,
  projectName,
  dueDate,
  status,
  assigneeName
}: {
  title: string;
  projectName: string;
  dueDate: string;
  status: TaskStatus;
  assigneeName: string;
}) {
  return (
    <TableRow className="rounded-2xl border border-border shadow-sm">
      <TableCell className="font-medium text-foreground">{title}</TableCell>
      <TableCell className="text-slate-500">{projectName}</TableCell>
      <TableCell className="text-slate-500">{assigneeName}</TableCell>
      <TableCell className="text-slate-500">{dueDate}</TableCell>
      <TableCell>
        <Badge variant={statusMap[status]}>{status}</Badge>
      </TableCell>
    </TableRow>
  );
}
