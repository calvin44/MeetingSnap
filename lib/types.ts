export interface TabMetadata {
  id: string
  title: string
  hasContent: boolean
}

export interface ApiError {
  error: string
  code?: string | number
  details?: string
}
