import { LayoutGrid, UserCircle, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useAuthStore } from "../store/useAuthStore";
import { Badge } from "./ui/badge";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";

const navItems = [
  { label: "Projects", to: "/projects", icon: LayoutGrid }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const roleLabel = user?.role ?? "member";
  const roleVariant =
    roleLabel === "admin" ? "danger" : roleLabel === "manager" ? "warning" : "info";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-panel px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
          TT
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Team Task</p>
          <p className="text-xs text-slate-500">SaaS Console</p>
        </div>
        <Badge variant={roleVariant} className="ml-auto capitalize">
          {roleLabel}
        </Badge>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-slate-600 hover:bg-muted"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
              isActive ? "bg-primary text-white shadow-soft" : "text-slate-600 hover:bg-muted"
            )
          }
        >
          <UserCircle className="h-4 w-4" />
          Profile
        </NavLink>

        <button
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-muted"
          onClick={() => setLogoutOpen(true)}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>

        <Modal
          open={logoutOpen}
          onOpenChange={setLogoutOpen}
          title="Log out"
          description="Are you sure to logout?"
        >
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </Button>
          </div>
        </Modal>
      </div>
    </aside>
  );
}
