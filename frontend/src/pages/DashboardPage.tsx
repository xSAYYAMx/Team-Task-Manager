import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Modal } from "../components/ui/modal";
import { Input } from "../components/ui/input";
import { SelectRoot } from "../components/ui/select";
import { Table, TableBody, TableHead } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { useTaskStore } from "../store/useTaskStore";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useToastStore } from "../store/useToastStore";
import { statusOptions, priorityOptions } from "../utils/constants";

export default function DashboardPage() {
  const { tasks, fetchTasks, createTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { users, fetchUsers, loading: usersLoading, error: usersError } = useUserStore();
  const { user } = useAuthStore();
  const { pushToast } = useToastStore();
  const { updateTaskStatus } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    if (isAdmin) {
      fetchUsers();
    }
  }, [fetchProjects, fetchTasks, fetchUsers, isAdmin]);

  useEffect(() => {
    if (open && isAdmin) {
      fetchUsers();
    }
  }, [fetchUsers, isAdmin, open]);

  useEffect(() => {
    if (isAdmin && users.length > 0 && !selectedAssignee) {
      setSelectedAssignee(users[0]._id);
    }
  }, [isAdmin, selectedAssignee, users]);

  const visibleTasks = useMemo(() => {
    if (isAdmin) {
      return tasks;
    }
    return tasks.filter((task) => task.assignee?._id === user?.id);
  }, [isAdmin, tasks, user?.id]);

  const stats = useMemo(() => {
    const total = visibleTasks.length;
    const completed = visibleTasks.filter((task) => task.status === "Completed").length;
    const pending = visibleTasks.filter((task) => task.status === "Pending").length;
    const overdue = visibleTasks.filter((task) => task.status === "Overdue").length;
    return [
      { label: "Total tasks", value: String(total), helper: "Across all projects" },
      { label: "Completed", value: String(completed), helper: "Last 30 days" },
      { label: "Pending", value: String(pending), helper: "Needs attention" },
      { label: "Overdue", value: String(overdue), helper: "Escalate today" }
    ];
  }, [visibleTasks]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Team'}! 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is a quick summary of your tasks and recent activity.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent tasks</h2>
            <p className="text-xs text-slate-500">
              Latest tasks updated by your team.
            </p>
          </div>
          {isAdmin ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
          ) : null}
        </div>
        <div className="mt-6">
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Project</th>
                <th className="px-4 py-2">Assignee</th>
                <th className="px-4 py-2">Due</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </TableHead>
            <TableBody>
              {visibleTasks.map((task) => (
                <tr key={task._id} className="rounded-2xl border border-border bg-white">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {task.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {task.project?.name ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {task.assignee?.name ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {task.dueDate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isAdmin ? (
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "success"
                            : task.status === "Overdue"
                              ? "danger"
                              : task.status === "In Review"
                                ? "warning"
                                : "info"
                        }
                      >
                        {task.status}
                      </Badge>
                    ) : (
                      <SelectRoot
                        value={task.status}
                        onValueChange={(value) =>
                          updateTaskStatus(task._id, value as any)
                        }
                        placeholder="Status"
                        options={statusOptions.map((option) => ({
                          label: option,
                          value: option
                        }))}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {isAdmin ? (
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Create task"
          description="Assign a task to your team in seconds."
        >
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedProject) {
                setFormError("Select a project before saving the task.");
                return;
              }
              if (!selectedAssignee) {
                setFormError("Select an assignee before saving the task.");
                return;
              }
              setFormError(null);
              const formData = new FormData(event.currentTarget);
              const result = await createTask({
                title: String(formData.get("title")),
                project: selectedProject,
                assignee: selectedAssignee,
                dueDate: String(formData.get("dueDate")),
                status: status as any,
                priority: priority as any
              });
              if (result.ok) {
                await fetchTasks();
                pushToast("Task created", "success");
              }
              setOpen(false);
            }}
          >
            <Input name="title" placeholder="Task title" required />
            <SelectRoot
              value={selectedProject}
              onValueChange={setSelectedProject}
              placeholder="Select project"
              options={projects.map((project) => ({
                label: project.name,
                value: project._id
              }))}
            />
            <SelectRoot
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
              placeholder="Assign to"
              options={users.map((member) => ({
                label: `${member.name} (${member.role})`,
                value: member._id
              }))}
            />
            {usersLoading ? (
              <p className="text-xs text-slate-500">Loading users...</p>
            ) : null}
            {usersError ? (
              <p className="text-xs font-semibold text-danger">{usersError}</p>
            ) : null}
            <Input name="dueDate" placeholder="Due date" required />
            {formError ? (
              <p className="text-xs font-semibold text-danger">{formError}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectRoot
                value={status}
                onValueChange={setStatus}
                placeholder="Status"
                options={statusOptions.map((option) => ({
                  label: option,
                  value: option
                }))}
              />
              <SelectRoot
                value={priority}
                onValueChange={setPriority}
                placeholder="Priority"
                options={priorityOptions.map((option) => ({
                  label: option,
                  value: option
                }))}
              />
            </div>
            <Button type="submit" className="w-full">
              Save task
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
