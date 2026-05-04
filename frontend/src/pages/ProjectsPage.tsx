import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { SelectRoot } from "../components/ui/select";
import EmptyState from "../components/EmptyState";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const statusOptions = ["On Track", "At Risk", "Delayed"];

export default function ProjectsPage() {
  const { projects, fetchProjects, createProject } = useProjectStore();
  const { user } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("On Track");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (open && isAdmin) {
      fetchUsers();
    }
  }, [open, isAdmin, fetchUsers]);

  const memberUsers = users.filter((u) => u.role === "member");

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-slate-500">
            Track progress across all initiatives in one place.
          </p>
        </div>
        {isAdmin ? (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        ) : null}
      </motion.div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            isAdmin
              ? "Create a project to start assigning tasks."
              : "Ask an admin to create your first project."
          }
          actionLabel={isAdmin ? "Create project" : "Contact admin"}
          onAction={isAdmin ? () => setOpen(true) : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              id={project._id}
              name={project.name}
              description={project.description}
              status={project.status}
              dueDate={project.dueDate}
              membersCount={project.memberCount ?? project.members?.length ?? 0}
            />
          ))}
        </div>
      )}

      {isAdmin ? (
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Create project"
          description="Set the project scope and invite collaborators."
        >
          <Card className="border-0 bg-transparent shadow-none">
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const selectedMembers = formData.getAll("members") as string[];
                await createProject({
                  name: String(formData.get("name")),
                  description: String(formData.get("description")),
                  status: status as any,
                  dueDate: String(formData.get("dueDate")),
                  memberCount: Number(formData.get("memberCount") || 0),
                  members: selectedMembers
                });
                setOpen(false);
              }}
            >
              <Input name="name" placeholder="Project name" required />
              <Input name="description" placeholder="Short description" required />
              <Input name="dueDate" placeholder="Target date" required />
              <Input name="memberCount" type="number" placeholder="No. of project members" min="0" required />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Members</label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto rounded-lg border border-border p-3">
                  {memberUsers.map((u) => (
                    <label key={u._id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="members" value={u._id} className="rounded border-slate-300" />
                      <span className="text-sm text-foreground">{u.name}</span>
                    </label>
                  ))}
                  {memberUsers.length === 0 && (
                    <span className="text-sm text-slate-500">No members available</span>
                  )}
                </div>
              </div>
              <SelectRoot
                value={status}
                onValueChange={setStatus}
                placeholder="Status"
                options={statusOptions.map((option) => ({
                  label: option,
                  value: option
                }))}
              />
              <Button type="submit" className="w-full">
                Save project
              </Button>
            </form>
          </Card>
        </Modal>
      ) : null}
    </div>
  );
}
