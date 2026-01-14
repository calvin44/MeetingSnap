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

export interface SendEmailRequest {
  to: string
  subject: string
  html: string
  tabTitle: string
}

export interface SendEmailResponse {
  success: boolean
  messageId?: string
}

// Unions
export type TabsResponse = TabMetadata | ApiErrorResponse
export type ExportResponse = ExportSuccessResponse | ApiErrorResponse
