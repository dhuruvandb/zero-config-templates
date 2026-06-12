const API_BASE = "http://localhost:5000";

export async function post(path: string, body: any) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function get(path: string) {
  const res = await fetch(API_BASE + path, {
    credentials: "include",
  });
  return res.json();
}

export async function del(path: string) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export default { post, get, del };
