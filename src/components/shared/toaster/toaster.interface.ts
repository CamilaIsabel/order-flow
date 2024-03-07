export type AppToasterTypes = 'info' | 'warning' | 'error' | 'success'

export interface ToasterPayload {
  text?: string
  title: string
  type: AppToasterTypes
}

export interface AppToasterPayload extends ToasterPayload {
  duration?: number
}

export interface Toaster extends AppToasterPayload {
  id: string
}
