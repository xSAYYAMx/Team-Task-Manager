import { create } from "zustand";
import {
  createProject as createProjectApi,
  fetchProjects,
  updateProject as updateProjectApi
} from "../services/projectApi";

type ProjectMember = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type Project = {
  _id: string;
  name: string;
  description: string;
  status: "On Track" | "At Risk" | "Delayed";
  dueDate: string;
  memberCount?: number;
  members: ProjectMember[];
};

type ProjectState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (payload: {
    name: string;
    description: string;
    status: Project["status"];
    dueDate: string;
    memberCount?: number;
    members?: string[];
  }) => Promise<{ ok: boolean; project?: Project }>;
  updateProjectMembers: (id: string, members: string[]) => Promise<boolean>;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchProjects();
      set({ projects: data, loading: false });
    } catch (_error) {
      set({ loading: false, error: "Failed to load projects" });
    }
  },
  createProject: async (payload) => {
    set({ loading: true, error: null });
    try {
      const project = await createProjectApi(payload);
      set((state) => ({
        projects: [project, ...state.projects],
        loading: false
      }));
      return { ok: true, project };
    } catch (_error) {
      set({ loading: false, error: "Failed to create project" });
      return { ok: false };
    }
  },
  updateProjectMembers: async (id, members) => {
    set({ loading: true, error: null });
    try {
      const project = await updateProjectApi(id, { members });
      set((state) => ({
        projects: state.projects.map((item) =>
          item._id === project._id ? project : item
        ),
        loading: false
      }));
      return true;
    } catch (_error) {
      set({ loading: false, error: "Failed to update project" });
      return false;
    }
  }
}));
