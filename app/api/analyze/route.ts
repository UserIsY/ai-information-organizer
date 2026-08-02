import OpenAI from "openai";
import { NextResponse } from "next/server";

const requestMap = new Map<string, number>();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});


export async function POST(request: Request) {

  try {

    const ip =
      request.headers.get("x-forwarded-for") || "unknown";


    const lastRequest = requestMap.get(ip);


    if (
      lastRequest &&
      Date.now() - lastRequest < 30000
    ) {
      return NextResponse.json(
        {
          error:"Please wait before trying again."
        },
        {
          status:429
        }
      );
    }

    requestMap.set(
      ip,
      Date.now()
    );

    const body = await request.json();

    const notes = body.text;

    if (!notes || notes.length > 5000) {
  return NextResponse.json(
    {
      error: "Input is too long. Please keep it under 5000 characters.",
    },
    {
      status: 400,
    }
  );
}

    const systemPrompt = process.env.SYSTEM_PROMPT;

    if (!systemPrompt) {
  throw new Error("SYSTEM_PROMPT is missing");
}

    const response = await client.chat.completions.create({

     model: "deepseek-v4-flash",

     max_tokens: 1000,

  messages:[
 {
  role:"system",
  content:systemPrompt
 },
  {
    role: "user",
    content: notes,
  },
],

    });


    const result =
      response.choices[0].message.content;


    return NextResponse.json({
      result,
    });


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "AI analysis failed",
      },
      {
        status: 500,
      }
    );

  }
}