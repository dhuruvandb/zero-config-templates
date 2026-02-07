const API_BASE = import.meta.env.VITE_API_BASE

async function parseJson(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.indexOf('application/json') >= 0) {
    return res.json()
  }
  return null
}

export async function post(path: string, body: unknown) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return parseJson(res)
}

export async function authGet(path: string, token: string) {
  const res = await fetch(API_BASE + path, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return parseJson(res)
}

export async function authPost(path: string, token: string, body: unknown) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return parseJson(res)
}

export async function authDelete(path: string, token: string) {
  const res = await fetch(API_BASE + path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  return parseJson(res)
}

export default { post, authGet, authPost, authDelete }
