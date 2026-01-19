export interface TabMetadata {
  id: string
  title: string
  hasContent: boolean
}

export interface ExportSuccessResponse {
  html: string
  tabId: string
  metadata?: {
    size: number
    duration: number
  }
}

export interface ApiErrorResponse {
  error: string
  code?: string | number
  details?: string
}



// Unions
export type TabsResponse = TabMetadata | ApiErrorResponse
export type ExportResponse = ExportSuccessResponse | ApiErrorResponse
