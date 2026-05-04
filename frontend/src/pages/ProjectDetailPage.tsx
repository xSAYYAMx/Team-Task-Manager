import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Plus, Users, LayoutGrid, List } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableHead } from "../components/ui/table";
import { Modal } from "../components/ui/modal";
import { Input } from "../components/ui/input";
import { SelectRoot } from "../components/ui/select";
import { useTaskStore } from "../store/useTaskStore";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useToastStore } from "../store/useToastStore";
import { statusOptions, priorityOptions } from "../utils/constants";

const columns = ["Pending", "In Review", "Completed", "Overdue"] as const;
const statusBadgeClass = {
  Pending: "bg-amber-100 text-amber-700",
  "In Review": "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-rose-100 text-rose-700"
} as const;

const priorityBadgeClass = {
  Urgent: "bg-rose-700 text-white",
  High: "bg-rose-500 text-white",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700"
} as const;

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { tasks, fetchTasks, createTask, updateTaskStatus, updateTaskFields } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { users, fetchUsers, loading: usersLoading, error: usersError } = useUserStore();
  const { user } = useAuthStore();
  const { pushToast } = useToastStore();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"board" | "list">("board");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [selectedProject, setSelectedProject] = useState<string>(projectId || "");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<
    "title" | "assignee" | "priority" | "status" | "dueDate" | null
  >(null);
  const [draftValue, setDraftValue] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      fetchUsers();
    }
  }, [fetchProjects, fetchUsers, isAdmin]);

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

  useEffect(() => {
    fetchTasks(projectId);
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [fetchTasks, projectId]);

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.project?._id === projectId),
    [tasks, projectId]
  );

  const visibleTasks = projectTasks;

  const statusCounts = useMemo(() => {
    return columns.reduce<Record<string, number>>((acc, statusKey) => {
      acc[statusKey] = visibleTasks.filter((task) => task.status === statusKey).length;
      return acc;
    }, {});
  }, [visibleTasks]);

  const assigneeOptions = users.map((member) => ({
    label: `${member.name} (${member.role})`,
    value: member._id
  }));

  const currentProject = useMemo(
    () => projects.find((p) => p._id === projectId),
    [projects, projectId]
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {currentProject ? currentProject.name : "Project view"}
          </h1>
          <p className="text-sm text-slate-500">
            {projectId ? `Project ID: ${projectId}` : "Overview of project tasks"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border bg-panel p-1">
            <button
              onClick={() => setView("board")}
              className={`rounded-md p-1.5 transition ${view === "board" ? "bg-muted text-foreground" : "text-slate-500 hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-md p-1.5 transition ${view === "list" ? "bg-muted text-foreground" : "text-slate-500 hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setMembersOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Project members
          </Button>
          {isAdmin ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
          ) : null}
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <Card key={column} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {column}
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">
              {statusCounts[column] ?? 0}
            </p>
            <Badge className={`mt-2 w-fit capitalize ${statusBadgeClass[column]}`}>
              {column}
            </Badge>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-xs text-slate-500">
              Tasks for this project with live status.
            </p>
          </div>
        </div>
        <div className="mt-6">
          {view === "list" ? (
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-2">Task name</th>
                <th className="px-4 py-2">Assigned to</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">State</th>
                <th className="px-4 py-2">Due date</th>
              </tr>
            </TableHead>
            <TableBody>
              {visibleTasks.map((task) => (
                <tr key={task._id} className="rounded-2xl border border-border bg-white">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {isAdmin && editingTaskId === task._id && editingField === "title" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={draftValue}
                          onChange={(event) => setDraftValue(event.target.value)}
                          className="h-9"
                        />
                        <button
                          type="button"
                          className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                          onClick={async () => {
                            const ok = await updateTaskFields(task._id, {
                              title: draftValue
                            });
                            if (ok) {
                              pushToast("Task updated", "success");
                            }
                            setEditingTaskId(null);
                            setEditingField(null);
                          }}
                          aria-label="Save title"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{task.title}</span>
                        {isAdmin ? (
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("title");
                              setDraftValue(task.title);
                            }}
                            aria-label="Edit title"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {isAdmin && editingTaskId === task._id && editingField === "assignee" ? (
                      <div className="flex items-center gap-2">
                        <SelectRoot
                          value={draftValue}
                          onValueChange={setDraftValue}
                          placeholder="Assign to"
                          options={assigneeOptions}
                        />
                        <button
                          type="button"
                          className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                          onClick={async () => {
                            const ok = await updateTaskFields(task._id, {
                              assignee: draftValue
                            });
                            if (ok) {
                              pushToast("Task updated", "success");
                            }
                            setEditingTaskId(null);
                            setEditingField(null);
                          }}
                          aria-label="Save assignee"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{task.assignee?.name ?? "Unassigned"}</span>
                        {isAdmin ? (
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("assignee");
                              setDraftValue(task.assignee?._id ?? "");
                            }}
                            aria-label="Edit assignee"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isAdmin && editingTaskId === task._id && editingField === "priority" ? (
                      <div className="flex items-center gap-2">
                        <SelectRoot
                          value={draftValue}
                          onValueChange={setDraftValue}
                          placeholder="Priority"
                          options={priorityOptions.map((option) => ({
                            label: option,
                            value: option
                          }))}
                        />
                        <button
                          type="button"
                          className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                          onClick={async () => {
                            const ok = await updateTaskFields(task._id, {
                              priority: draftValue as any
                            });
                            if (ok) {
                              pushToast("Task updated", "success");
                            }
                            setEditingTaskId(null);
                            setEditingField(null);
                          }}
                          aria-label="Save priority"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge className={priorityBadgeClass[task.priority]}>
                          {task.priority}
                        </Badge>
                        {isAdmin ? (
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("priority");
                              setDraftValue(task.priority);
                            }}
                            aria-label="Edit priority"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isAdmin ? (
                      editingTaskId === task._id && editingField === "status" ? (
                        <div className="flex items-center gap-2">
                          <SelectRoot
                            value={draftValue}
                            onValueChange={setDraftValue}
                            placeholder="Status"
                            options={statusOptions.map((option) => ({
                              label: option,
                              value: option
                            }))}
                          />
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={async () => {
                              const ok = await updateTaskStatus(task._id, draftValue as any);
                              if (ok) {
                                pushToast("Task updated", "success");
                              }
                              setEditingTaskId(null);
                              setEditingField(null);
                            }}
                            aria-label="Save status"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge className={statusBadgeClass[task.status]}>
                            {task.status}
                          </Badge>
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("status");
                              setDraftValue(task.status);
                            }}
                            aria-label="Edit status"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    ) : task.assignee?._id === user?.id ? (
                      editingTaskId === task._id && editingField === "status" ? (
                        <div className="flex items-center gap-2">
                          <SelectRoot
                            value={draftValue}
                            onValueChange={setDraftValue}
                            placeholder="Status"
                            options={statusOptions.map((option) => ({
                              label: option,
                              value: option
                            }))}
                          />
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={async () => {
                              const ok = await updateTaskStatus(
                                task._id,
                                draftValue as any
                              );
                              if (ok) {
                                await fetchTasks(projectId);
                                pushToast("Status updated", "success");
                              }
                              setEditingTaskId(null);
                              setEditingField(null);
                            }}
                            aria-label="Save status"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge className={statusBadgeClass[task.status]}>
                            {task.status}
                          </Badge>
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("status");
                              setDraftValue(task.status);
                            }}
                            aria-label="Edit status"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    ) : (
                      <Badge className={statusBadgeClass[task.status]}>
                        {task.status}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {isAdmin && editingTaskId === task._id && editingField === "dueDate" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={draftValue}
                          onChange={(event) => setDraftValue(event.target.value)}
                          className="h-9"
                        />
                        <button
                          type="button"
                          className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                          onClick={async () => {
                            const ok = await updateTaskFields(task._id, {
                              dueDate: draftValue
                            });
                            if (ok) {
                              pushToast("Task updated", "success");
                            }
                            setEditingTaskId(null);
                            setEditingField(null);
                          }}
                          aria-label="Save due date"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{task.dueDate}</span>
                        {isAdmin ? (
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingField("dueDate");
                              setDraftValue(task.dueDate);
                            }}
                            aria-label="Edit due date"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {visibleTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No tasks for this selection.
                  </td>
                </tr>
              ) : null}
            </TableBody>
          </Table>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 pb-4 lg:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => (
                <div
                  key={column}
                  className="flex flex-col rounded-xl bg-slate-100/50 p-4"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("ring-2", "ring-primary");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("ring-2", "ring-primary");
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("ring-2", "ring-primary");
                    const taskId = e.dataTransfer.getData("taskId");
                    if (taskId) {
                      const ok = await updateTaskStatus(taskId, column as any);
                      if (ok) {
                        await fetchTasks(projectId);
                        pushToast("Task moved to " + column, "success");
                      }
                    }
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{column}</h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                      {statusCounts[column] ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[100px]">
                    {visibleTasks
                      .filter((t) => t.status === column)
                      .map((task) => (
                        <div
                          key={task._id}
                          draggable={isAdmin || task.assignee?._id === user?.id}
                          onDragStart={(e) => {
                            e.dataTransfer.setData("taskId", task._id);
                          }}
                          className={`rounded-lg border border-border bg-panel p-4 shadow-sm transition hover:shadow ${
                            isAdmin || task.assignee?._id === user?.id
                              ? "cursor-grab active:cursor-grabbing hover:border-primary/50"
                              : ""
                          }`}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Badge className={priorityBadgeClass[task.priority]}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs font-medium text-slate-500">
                              {task.dueDate}
                            </span>
                          </div>
                          <h4 className="mb-3 font-medium text-foreground">{task.title}</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {task.assignee?.name?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="text-xs text-slate-500">
                                {task.assignee?.name ?? "Unassigned"}
                              </span>
                            </div>
                            {isAdmin ? (
                               <button
                                 type="button"
                                 className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                 onClick={() => {
                                   setView("list");
                                   setEditingTaskId(task._id);
                                   setEditingField("title");
                                   setDraftValue(task.title);
                                 }}
                               >
                                 <Pencil className="h-3 w-3" />
                               </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {isAdmin ? (
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Create task"
          description="Assign tasks to keep everyone aligned."
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
                await fetchTasks(projectId);
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
              options={assigneeOptions}
            />
            {assigneeOptions.length === 0 ? (
              <p className="text-xs text-slate-500">
                No users available for assignment.
              </p>
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

        <Modal
          open={membersOpen}
          onOpenChange={setMembersOpen}
          title="Project members"
          description="Members working on this project."
        >
          <div className="space-y-3">
            {currentProject?.members?.length ? currentProject.members.map((member) => (
              <div
                key={member._id}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
                <Badge
                  className={
                    member.role === "admin"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                  }
                >
                  {member.role}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No members are currently working on this project.</p>
            )}
          </div>
        </Modal>
    </div>
  );
}
