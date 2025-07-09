export type JsonArray   = JsonData[]
export type JsonData    = JsonLiteral | JsonObject | JsonArray
export type JsonLiteral = string | number | boolean | null
export type JsonObject  = { [key: string]: JsonData }
