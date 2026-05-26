export type SlotStatus = 'empty' | 'uploading' | 'processing-bg' | 'done' | 'error'

export interface PhotoSlot {
  id: number
  file: File | null
  preview: string | null
  processedUrl: string | null
  status: SlotStatus
  error?: string
}
