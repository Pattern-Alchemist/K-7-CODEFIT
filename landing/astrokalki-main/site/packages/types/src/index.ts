import { z } from "zod"

// User Types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  dateOfBirth: z.date().optional(),
  location: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// Consultation Types
export const ConsultationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["flash", "cosmic-code", "karma-level", "karma-release", "moksha-roadmap", "walk-dharma"]),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  scheduledAt: z.date().optional(),
  duration: z.number(), // in minutes
  price: z.number(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Consultation = z.infer<typeof ConsultationSchema>

// Payment Types
export const PaymentSchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  amount: z.number(),
  currency: z.string(),
  method: z.enum(["upi", "paypal", "stripe"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  transactionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Payment = z.infer<typeof PaymentSchema>

// Reading Types
export const ReadingSchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  type: z.string(),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
})

export type Reading = z.infer<typeof ReadingSchema>

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
})

export type ApiResponse = z.infer<typeof ApiResponseSchema>
