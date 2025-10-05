import { z } from 'zod'
import { ItemSchema } from './types'

const ItemsSchema = z.array(ItemSchema)

// Museum related schemas
const MuseumSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  visibility: z.enum(['public', 'private']),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
})

const MuseumsSchema = z.array(MuseumSchema)

const CreateMuseumSchema = z.object({
  userId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional(),
  imageUrl: z.string().optional(),
})

const UpdateTitleSchema = z.object({
  title: z.string(),
})

// Artwork search schemas
const ArtworkSearchResponseSchema = z.object({
  total: z.number(),
  objectIDs: z.array(z.number()),
})

const MetObjectSchema = z.object({
  objectID: z.number(),
  isHighlight: z.boolean().optional(),
  accessionNumber: z.string().optional(),
  accessionYear: z.string().optional(),
  isPublicDomain: z.boolean().optional(),
  primaryImage: z.string().optional(),
  primaryImageSmall: z.string().optional(),
  additionalImages: z.array(z.string()).optional(),
  constituents: z.array(z.any()).optional(),
  department: z.string().optional(),
  objectName: z.string().optional(),
  title: z.string().optional(),
  culture: z.string().optional(),
  period: z.string().optional(),
  dynasty: z.string().optional(),
  reign: z.string().optional(),
  portfolio: z.string().optional(),
  artistRole: z.string().optional(),
  artistPrefix: z.string().optional(),
  artistDisplayName: z.string().optional(),
  artistDisplayBio: z.string().optional(),
  artistSuffix: z.string().optional(),
  artistAlphaSort: z.string().optional(),
  artistNationality: z.string().optional(),
  artistBeginDate: z.string().optional(),
  artistEndDate: z.string().optional(),
  artistGender: z.string().optional(),
  artistWikidata_URL: z.string().optional(),
  artistULAN_URL: z.string().optional(),
  objectDate: z.string().optional(),
  objectBeginDate: z.number().optional(),
  objectEndDate: z.number().optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  measurements: z.array(z.any()).optional(),
  creditLine: z.string().optional(),
  geographyType: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  locale: z.string().optional(),
  locus: z.string().optional(),
  excavation: z.string().optional(),
  river: z.string().optional(),
  classification: z.string().optional(),
  rightsAndReproduction: z.string().optional(),
  linkResource: z.string().optional(),
  metadataDate: z.string().optional(),
  repository: z.string().optional(),
  objectURL: z.string().optional(),
  tags: z.array(z.any()).optional(),
  objectWikidata_URL: z.string().optional(),
  isTimelineWork: z.boolean().optional(),
  GalleryNumber: z.string().optional(),
})

// Type exports
export type Museum = z.infer<typeof MuseumSchema>
export type CreateMuseumRequest = z.infer<typeof CreateMuseumSchema>
export type UpdateTitleRequest = z.infer<typeof UpdateTitleSchema>
export type ArtworkSearchResponse = z.infer<typeof ArtworkSearchResponseSchema>
export type MetObject = z.infer<typeof MetObjectSchema>

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

// ============ Museum API Functions ============

// [GET] /api/v1/museums?exclude_user_id=1 (developブランチの既存実装)
export async function fetchMuseumItems(userId: number) {
  const res = await fetch(`${base}/api/v1/museums?excludeUserId=${userId}&limit=10`)
  if (!res.ok) throw new Error(`Failed to fetch museums: ${res.status}`)
  const json = await res.json()
  const parsed = MuseumsSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid museums response: ${parsed.error.message}`)
  }
  return parsed.data.map(museum => ({
    id: museum.id,
    name: museum.name
  }))
}

// [GET] /api/v1/museums/:museumId (developブランチの既存実装)
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

/**
 * 公開ミュージアム取得（指定ユーザー以外） - 拡張版
 */
export async function fetchPublicMuseums(excludeUserId: number, limit: number = 10): Promise<Museum[]> {
  const params = new URLSearchParams({
    excludeUserId: excludeUserId.toString(),
    limit: limit.toString(),
  })

  const res = await fetch(`${base}/api/v1/museums?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to fetch museums: ${res.status}`)
  }

  const json = await res.json()
  const parsed = MuseumsSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid museums response: ${parsed.error.message}`)
  }
  return parsed.data
}

/**
 * ミュージアム詳細取得
 */
export async function fetchMuseumById(id: number): Promise<Museum> {
  const res = await fetch(`${base}/api/v1/museums/${id}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to fetch museum: ${res.status}`)
  }

  const json = await res.json()
  const parsed = MuseumSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid museum response: ${parsed.error.message}`)
  }
  return parsed.data
}

/**
 * ミュージアム作成
 */
export async function createMuseum(museum: CreateMuseumRequest): Promise<Museum> {
  const res = await fetch(`${base}/api/v1/museums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(museum),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to create museum: ${res.status}`)
  }

  const json = await res.json()
  const parsed = MuseumSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid create museum response: ${parsed.error.message}`)
  }
  return parsed.data
}

/**
 * ミュージアムタイトル更新
 */
export async function updateMuseumTitle(id: number, title: string): Promise<{ message: string }> {
  const res = await fetch(`${base}/api/v1/museums/${id}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to update museum title: ${res.status}`)
  }

  return await res.json()
}

// ============ Artwork Search API Functions ============

/**
 * 作品検索（MET Museum API連携）
 */
export async function searchArtworks(params: {
  isHighlight?: boolean
  objectDate?: string
  city?: string
  medium?: string
  limit?: number
}): Promise<ArtworkSearchResponse> {
  const searchParams = new URLSearchParams()

  if (params.isHighlight !== undefined) {
    searchParams.append('isHighlight', params.isHighlight.toString())
  }
  if (params.objectDate) {
    searchParams.append('objectDate', params.objectDate)
  }
  if (params.city) {
    searchParams.append('city', params.city)
  }
  if (params.medium) {
    searchParams.append('medium', params.medium)
  }
  if (params.limit) {
    searchParams.append('limit', params.limit.toString())
  }

  const res = await fetch(`${base}/api/v1/search/artworks?${searchParams}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to search artworks: ${res.status}`)
  }

  const json = await res.json()
  const parsed = ArtworkSearchResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid artwork search response: ${parsed.error.message}`)
  }
  return parsed.data
}

/**
 * MET Museum オブジェクト詳細取得
 */
export async function fetchMetObject(objectId: number): Promise<MetObject> {
  const res = await fetch(`${base}/api/v1/met/objects/${objectId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `Failed to fetch MET object: ${res.status}`)
  }

  const json = await res.json()
  const parsed = MetObjectSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Invalid MET object response: ${parsed.error.message}`)
  }
  return parsed.data
}

// ============ Health Check ============

/**
 * ヘルスチェック
 */
export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${base}/health`)
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`)
  }
  return await res.json()
}