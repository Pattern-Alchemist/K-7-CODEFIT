import { type NextRequest, NextResponse } from "next/server"
import { routeUserRequest } from "@/lib/agents/routing-agent"

export async function POST(req: NextRequest) {
  try {
    const { userInput, metadata } = await req.json()

    if (!userInput) {
      return NextResponse.json({ error: "User input required" }, { status: 400 })
    }

    const routing = await routeUserRequest(userInput, metadata || {})

    return NextResponse.json({
      success: true,
      routing,
    })
  } catch (err) {
    console.error("[RouteAgent] Error:", err)
    return NextResponse.json({ error: "Routing failed" }, { status: 500 })
  }
}
