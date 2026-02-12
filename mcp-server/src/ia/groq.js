import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // 👈 NO OpenAI
  baseURL: "https://api.groq.com/openai/v1",
});

export async function askGroq(texto) {
  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "user", content: texto }
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}
