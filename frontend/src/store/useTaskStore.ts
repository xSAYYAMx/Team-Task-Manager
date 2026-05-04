import { create } from "zustand";
import type { TaskStatus } from "../components/TaskRow";
import {
  createTask as createTaskApi,
  fetchTasks,
  updateTask as updateTaskApi
} from "../services/taskApi";

type TaskProject = {
  _id: string;
  name: string;
};

type TaskAssignee = {
  _id: string;
  name: string;
  email: string;
};

export type Task = {
  _id: string;
  title: string;
  project?: TaskProject;
  assignee?: TaskAssignee;
  dueDate: string;
  status: TaskStatus;
  priority: "Low" | "Medium" | "High" | "Urgent";
};

type TaskState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (payload: {
    title: string;
    project: string;
    assignee: string;
    dueDate: string;
    status: TaskStatus;
    priority: Task["priority"];
  }) => Promise<{ ok: boolean; task?: Task }>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
  updateTaskFields: (id: string, payload: Partial<Omit<Task, "_id">>) => Promise<boolean>;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTasks(projectId);
      set({ tasks: data, loading: false });
    } catch (_error) {
      set({ loading: false, error: "Failed to load tasks" });
    }
  },
  createTask: async (payload) => {
    set({ loading: true, error: null });
    try {
      const task = await createTaskApi(payload);
      set((state) => ({ tasks: [task, ...state.tasks], loading: false }));
      return { ok: true, task };
    } catch (_error) {
      set({ loading: false, error: "Failed to create task" });
      return { ok: false };
    }
  },
  updateTaskStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateTaskApi(id, { status });
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? updated : task)),
        loading: false
      }));
      return true;
    } catch (_error) {
      set({ loading: false, error: "Failed to update task" });
      return false;
    }
  },
  updateTaskFields: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateTaskApi(id, payload);
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? updated : task)),
        loading: false
      }));
      return true;
    } catch (_error) {
      set({ loading: false, error: "Failed to update task" });
      return false;
    }
  }
}));
