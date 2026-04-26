import Queue from "bull"
import { getRedisClient } from "@/lib/redis"
import { processReadingJob } from "@/lib/workers/reading-processor"
import { processEmailJob } from "@/lib/workers/email-processor"
import type { ReadingJobData, EmailJobData } from "@/lib/queue"
import { QUEUE_NAMES } from "@/lib/queue"

const redis = getRedisClient()

// Initialize queues
const readingQueue = new Queue<ReadingJobData>(QUEUE_NAMES.READING_GENERATION, { redis })
const emailQueue = new Queue<EmailJobData>(QUEUE_NAMES.EMAIL_FULFILLMENT, { redis })

// Process reading generation jobs
readingQueue.process(5, async (job) => {
  console.log(`[Worker] Processing reading job: ${job.id}`)
  try {
    const result = await processReadingJob(job.data)
    job.progress(100)
    return result
  } catch (err) {
    console.error(`[Worker] Reading job error:`, err)
    throw err
  }
})

// Process email fulfillment jobs
emailQueue.process(10, async (job) => {
  console.log(`[Worker] Processing email job: ${job.id}`)
  try {
    const result = await processEmailJob(job.data)
    job.progress(100)
    return result
  } catch (err) {
    console.error(`[Worker] Email job error:`, err)
    throw err
  }
})

// Listen for job events
readingQueue.on("completed", (job) => {
  console.log(`[Worker] Reading job completed: ${job.id}`)
})

readingQueue.on("failed", (job, err) => {
  console.error(`[Worker] Reading job failed: ${job?.id}`, err)
})

emailQueue.on("completed", (job) => {
  console.log(`[Worker] Email job completed: ${job.id}`)
})

emailQueue.on("failed", (job, err) => {
  console.error(`[Worker] Email job failed: ${job?.id}`, err)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Worker] SIGTERM received, shutting down gracefully...")
  await readingQueue.close()
  await emailQueue.close()
  process.exit(0)
})

console.log("[Worker] BullMQ worker started - listening for jobs")
