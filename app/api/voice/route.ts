// Optional .env.local:
//   ANTHROPIC_API_KEY=sk-ant-...
//   VOICE_MODEL=claude-haiku-4-5-20251001     (default, cheaper)
//   VOICE_MODEL=claude-sonnet-4-20250514    (higher quality, ~3–8× cost)

import { getAnthropicApiKey } from "@/lib/anthropic-api-key";
import { VOICE_SYSTEM_PROMPT } from "@/lib/voice-system-prompt";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
/** ~60 tokens JSON + 2 short sentences — lower cap = lower max bill. */
const MAX_TOKENS = 160;

export async function POST(request: Request) {
  let message: string;

  try {
    const body = (await request.json()) as { message?: string };
    message = typeof body.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  let apiKey: string;
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return NextResponse.json(
      { error: "Voice assistant is not configured." },
      { status: 500 },
    );
  }

  const model = process.env.VOICE_MODEL?.trim() || DEFAULT_MODEL;

  let anthropicResponse: Response;

  try {
    anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        stream: true,
        system: [
          {
            type: "text",
            text: VOICE_SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: message }],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the assistant." },
      { status: 502 },
    );
  }

  if (!anthropicResponse.ok || !anthropicResponse.body) {
    const errText = await anthropicResponse.text().catch(() => "");
    return NextResponse.json(
      { error: errText || "Assistant request failed." },
      { status: anthropicResponse.status || 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicResponse.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === "[DONE]") continue;

            try {
              const event = JSON.parse(payload) as {
                type?: string;
                delta?: { type?: string; text?: string };
              };
              if (
                event.type === "content_block_delta" &&
                event.delta?.type === "text_delta" &&
                event.delta.text
              ) {
                controller.enqueue(encoder.encode(event.delta.text));
              }
            } catch {
              /* skip malformed SSE chunk */
            }
          }
        }
      } catch {
        controller.error(new Error("Stream interrupted"));
        return;
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
