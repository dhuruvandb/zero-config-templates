const API_BASE = "http://localhost:5000";

export async function post(path: string, body: any) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log({ res });

  return res.json();
}

export async function authGet(path: string, token: string) {
  const res = await fetch(API_BASE + path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function authDelete(path: string, token: string) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default { post, authGet, authDelete };
