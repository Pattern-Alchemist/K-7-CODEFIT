import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { processReadingJob } from "@/lib/workers/reading-processor"
import { processEmailJob } from "@/lib/workers/email-processor"
import type { ReadingJobData, EmailJobData } from "@/lib/queue"

export async function POST(req: NextRequest) {
  try {
    const { orderId, service } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    // Fetch order
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.status !== "paid") {
      return NextResponse.json({ error: "Order not paid" }, { status: 400 })
    }

    // Process reading
    const jobData: ReadingJobData = {
      orderId,
      service: service || "karma-level",
      inputs: {
        question: "What is my karmic lesson?",
        lifeArea: "General",
      },
    }

    const result = await processReadingJob(jobData)

    // Queue email job
    const emailJobData: EmailJobData = {
      orderId,
      recipientEmail: "user@example.com",
      recipientName: "User",
      pdfUrl: result.pdfUrl,
      audioUrl: result.audioUrl,
      analysisText: "Reading complete",
    }

    await processEmailJob(emailJobData)

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("[ProcessOrder] Error:", err)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
