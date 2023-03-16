import fetch, { RequestInit } from 'node-fetch'

export default async function fetchWithTimeout(
  resource: string,
  options: { timeout?: number } & RequestInit = {}
) {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, options)

  clearTimeout(id)

  return response
}
