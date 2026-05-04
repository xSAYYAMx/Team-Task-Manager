import { Bell, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useAuthStore } from "../store/useAuthStore";
import { Badge } from "./ui/badge";

export default function Topbar() {
  const { user } = useAuthStore();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TT";
  const roleLabel = user?.role ?? "member";
  const roleVariant =
    roleLabel === "admin" ? "danger" : roleLabel === "manager" ? "warning" : "info";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-panel px-6 py-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search tasks, projects, or members"
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-full bg-muted p-2 text-slate-500 transition hover:bg-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-muted px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground">
              {user?.name ?? "Team Member"}
            </p>
            <Badge variant={roleVariant} className="mt-1 capitalize">
              {roleLabel}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
