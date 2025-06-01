import { NextResponse } from "next/server";
import Retell from "retell-sdk";

export async function POST(req: Request) {
  try {
    const { agentId, conversationFlowId } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_RETELL_API_KEY;

    if (!apiKey || !agentId || !conversationFlowId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const retellClient = new Retell({ apiKey });

    // Create an agent (example)
    const response = await retellClient.agent.create({
      response_engine: {
        llm_id: conversationFlowId,
        type: 'retell-llm',
      },
      agent_name: 'Auro Voice Agent',
      voice_id: '11labs-Adrian', // You can customize this
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error starting Retell conversation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 