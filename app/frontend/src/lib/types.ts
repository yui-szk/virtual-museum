import { z } from 'zod'

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string().datetime().or(z.string()), // tolerate plain string in dev
})

export type Item = z.infer<typeof ItemSchema>

