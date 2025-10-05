import { z } from 'zod'
import { ItemSchema } from './types'

const ItemsSchema = z.array(ItemSchema)

const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

if (!base) {
  // Surface a clear error early in dev if env is missing
  console.warn('VITE_API_BASE_URL is not set; API calls will likely fail')
}

export async function fetchItems() {
  const res = await fetch(`${base}/api/v1/items`)
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`)
  const json = await res.json()
  const parsed = ItemsSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid items response: ${parsed.error.message}`)
  }
  return parsed.data
}

export async function postItem(body: { name: string }) {
  const res = await fetch(`${base}/api/v1/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to create item: ${res.status}`)
  }
  const json = await res.json()
  const parsed = ItemSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid create response: ${parsed.error.message}`)
  }
  return parsed.data
}

// [GET] /api/v1/museums?exclude_user_id=1
export async function fetchMuseumItems(userId: number) {
  const res = await fetch(`${base}/api/v1/museums?excludeUserId=${userId}&limit=10`)

  if (!res.ok) throw new Error(`Failed to fetch museum items: ${res.status}`)
  const json = await res.json()
  const parsed = ItemsSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid museum items response: ${parsed.error.message}`)
  }
  return parsed.data
}

// [GET] /api/v1/museums/:museumId
// Define MuseumSchema to match the structure you described
export const MuseumSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  description: z.string(),
  visibility: z.string(),
  imageUrl: z.string(),
  createdAt: z.string(),
})

export async function fetchMuseumItemById(museumId: number) {
  const res = await fetch(`${base}/api/v1/museums/${museumId}`)

  if (!res.ok) throw new Error(`Failed to fetch museum item: ${res.status}`)
  const json = await res.json()
  const parsed = MuseumSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid museum item response: ${parsed.error.message}`)
  }
  return parsed.data
}
