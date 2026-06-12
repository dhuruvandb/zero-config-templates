const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

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
    credentials: 'include',
    body: JSON.stringify(body),
  })

  return parseJson(res)
}

export default { post }
