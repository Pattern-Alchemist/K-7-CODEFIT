// Types for job data
export interface ReadingJobData {
  orderId: string
  userId?: string
  inputs: {
    question?: string
    dob?: string
    tob?: string
    location?: string
    lifeArea?: string
    method?: string
  }
  service: "flash-k" | "cosmic-code" | "karma-level" | "karma-release" | "moksha-roadmap" | "dharma-walk"
}

export interface EmailJobData {
  orderId: string
  recipientEmail: string
  recipientName: string
  pdfUrl?: string
  audioUrl?: string
  analysisText: string
}

// Queue initialization functions
export async function initializeQueues() {
  // This will be called in the worker server
  // For now, just export the types and helper functions
}

export const QUEUE_NAMES = {
  READING_GENERATION: "reading-generation",
  EMAIL_FULFILLMENT: "email-fulfillment",
  PDF_GENERATION: "pdf-generation",
  AUDIO_GENERATION: "audio-generation",
}
