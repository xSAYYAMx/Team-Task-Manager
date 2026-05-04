import { api } from "./api";

export async function fetchProjects() {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(payload: Record<string, unknown>) {
  const response = await api.post("/projects", payload);
  return response.data;
}

export async function updateProject(id: string, payload: Record<string, unknown>) {
  const response = await api.patch(`/projects/${id}`, payload);
  return response.data;
}
