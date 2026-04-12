import backend from "../../network/backend";

export async function markNotificationReadAPI(id) {
  return backend.post(`/marketing/read/${id}`);
}

export async function markAllNotificationReadAPI() {
  return backend.post(`/marketing/read-all`);
}
