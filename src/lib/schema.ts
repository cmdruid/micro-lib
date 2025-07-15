import { z } from 'zod'

type Literal = z.infer<typeof literal>
type Json    = Literal | { [key : string] : Json } | Json[]

export const big     = z.bigint()
export const bool    = z.boolean()
export const date    = z.date()
export const num     = z.number().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER)
export const int     = num.int()
export const u8a     = z.instanceof(Uint8Array)
export const str     = z.string()
export const stamp   = int.min(500_000_000)
export const any     = z.any()
export const zod     = z
export const char  = int.min(0).max(0xFF)
export const short = int.min(0).max(0xFFFF)
export const uint  = int.min(0).max(0xFFFFFFFF)

export const float  = z.number().refine((e) => String(e).includes('.'))

export const float2 = float.refine((e) => {
  const parts = String(e).split('.').at(1)
  return parts !== undefined && parts.length <= 2
})

export const hex = z.string()
  .regex(/^[0-9a-fA-F]*$/)
  .refine(e => e.length % 2 === 0)

export const literal = z.union([
  z.string(), z.number(), z.boolean(), z.null()
])

export const json : z.ZodType<Json> = z.lazy(() =>
  z.union([ literal, z.array(json), z.record(str, json) ])
)

export const u8a20    = u8a.refine((e) => e.length === 20)
export const u8a32    = u8a.refine((e) => e.length === 32)
export const u8a33    = u8a.refine((e) => e.length === 33)
export const u8a64    = u8a.refine((e) => e.length === 64)

export const hex20    = hex.refine((e) => e.length === 40)
export const hex32    = hex.refine((e) => e.length === 64)
export const hex33    = hex.refine((e) => e.length === 66)
export const hex64    = hex.refine((e) => e.length === 128)

export const bytes  = z.union([ hex, u8a ])
export const byte32 = z.union([ hex32, u8a32 ])
export const byte33 = z.union([ hex33, u8a33 ])
export const byte64 = z.union([ hex64, u8a64 ])

export const base58    = z.string().regex(/^[1-9A-HJ-NP-Za-km-z]+$/)
export const base64    = z.string().regex(/^[a-zA-Z0-9+/]+={0,2}$/)
export const base64url = z.string().regex(/^[a-zA-Z0-9\-_]+={0,2}$/)
export const bech32    = z.string().regex(/^[a-z]+1[023456789acdefghjklmnpqrstuvwxyz]+$/)
