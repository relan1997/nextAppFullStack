// import { StreamingTextResponse,GoogleGenerativeAIStream } from "ai";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export default async function POST(request: Request): Promise<Response> {
//   const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const { message } = await request.json() as { message: string };
//     const streamingResponse = await model.generateContentStream(message);
//     const text = StreamingTextResponse(GoogleGenerativeAIStream (streamingResponse))

//     return new Response(JSON.stringify({
//       success: true,
//       message: "Generated message",
//       text
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return new Response(JSON.stringify({
//       success: false,
//       message: "Error in generating content"
//     }), { status: 500 });
//   }
// }

import { google } from "@ai-sdk/google";
import { generateText, GoogleGenerativeAIStream } from "ai";
export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const { text } = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      prompt: prompt,
    });
    Response.json({
      success: true,
      message: "Text generated",
      text,
    });
  } catch (error) {
    console.log("Unexpected error in generating text", error);
    Response.json({
      success: false,
      message: "Unexpected error in generating text",
    });
  }
}
