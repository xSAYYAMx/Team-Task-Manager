import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-slate-500">
          Manage your account details and permissions.
        </p>
      </motion.div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {user?.name?.[0] ?? "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {user?.name ?? "Unknown User"}
            </p>
            <p className="text-sm text-slate-500">{user?.email ?? ""}</p>
            <p className="text-xs text-slate-400">Role: {user?.role ?? ""}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/projects")}
          >
            Back to projects
          </Button>
          <Button
            variant="danger"
            onClick={() => setLogoutOpen(true)}
          >
            Log out
          </Button>
        </div>
      </Card>

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
  );
}
