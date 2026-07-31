import OpenAI from "openai";
import { NextResponse } from "next/server";


const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});


export async function POST(request: Request) {

  try {

    const body = await request.json();

    const notes = body.text;


    const response = await client.chat.completions.create({

     model: "deepseek-v4-flash",

      messages: [
        {
          role: "system",
          content:
            "你是一个信息整理助手。请把用户的混乱笔记整理成今天可执行的任务清单，按照优先级分类。",
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