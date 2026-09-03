import OpenAI from "openai";
import { NextResponse } from "next/server";

const requestMap = new Map<
  string,
  {
    count: number;
    date: string;
  }
>();

const apiKey = process.env.AI_API_KEY;
const baseURL = process.env.AI_BASE_URL;
const model = process.env.AI_MODEL || "deepseek-v4-flash";

console.log("API KEY CHECK:", apiKey?.slice(0, 12));
console.log("BASE URL:", baseURL);
console.log("MODEL:", model);

if (!apiKey || !baseURL || !model) {
  throw new Error("AI configuration is missing");
}

const client = new OpenAI({
  apiKey,
  baseURL,
});


export async function POST(request: Request) {

  try {

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";


    const today = new Date().toDateString();

const userRecord = requestMap.get(ip);


if (
  userRecord &&
  userRecord.date === today &&
  userRecord.count >= 10
) {
  return NextResponse.json(
    {
      error: "You've reached today's analysis limit."
    },
    {
      status: 429
    }
  );
}


if (!userRecord || userRecord.date !== today) {
  requestMap.set(ip, {
    count: 1,
    date: today,
  });
} else {
  requestMap.set(ip, {
    count: userRecord.count + 1,
    date: today,
  });
}


    const body = await request.json();

    const notes = body.text;


    if (!notes || notes.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Input is too long. Please keep it under 5000 characters.",
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

      model,

      temperature: 0,
      max_tokens: 600,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:`Extract tasks from these notes. Output the task list only. Do not include analysis. \n\n${notes}`,
        },
      ],

    });


const message = response.choices?.[0]?.message;

console.log("MESSAGE:", message);

const result =
  message?.content ||
  (message as any)?.reasoning_content ||
  "";

const cleaned = result.match(/### High Priority[\s\S]*?### End/);
const finalResult = cleaned ? cleaned[0] : result;

console.log("AI RESULT:", finalResult);

if (!finalResult) {
  throw new Error("Empty AI response");
}

    return NextResponse.json({
      result: finalResult,
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
