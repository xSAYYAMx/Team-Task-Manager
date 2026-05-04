import { api } from "./api";

export async function fetchTasks(projectId?: string) {
  const response = await api.get("/tasks", { params: { projectId } });
  return response.data;
}

export async function createTask(payload: Record<string, unknown>) {
  const response = await api.post("/tasks", payload);
  return response.data;
}

export async function updateTask(id: string, payload: Record<string, unknown>) {
  const response = await api.patch(`/tasks/${id}`, payload);
  return response.data;
}
