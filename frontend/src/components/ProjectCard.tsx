import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export default function ProjectCard({
  id,
  name,
  description,
  status,
  dueDate,
  membersCount
}: {
  id: string;
  name: string;
  description: string;
  status: "On Track" | "At Risk" | "Delayed";
  dueDate?: string;
  membersCount: number;
}) {
  const statusVariant =
    status === "On Track" ? "success" : status === "At Risk" ? "warning" : "danger";

  return (
    <Link to={`/projects/${id}`} className="block">
      <Card className="flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {dueDate || "TBD"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {membersCount} members
          </span>
        </div>
      </Card>
    </Link>
  );
}
