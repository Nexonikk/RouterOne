import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY || "your_api_key";

const client = new Mistral({ apiKey: apiKey });

export class MistralAI extends BaseLlm {
  static async chat(model: string, messages: Messages): Promise<LlmResponse> {
    const response = await client.chat.complete({
      model: model,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return {
      inputTokensConsumed: response.usage.promptTokens!,
      outputTokensConsumed: response.usage.completionTokens!,
      completions: {
        choices: [
          {
            message: {
              content: response.choices[0].message?.content as string,
            },
          },
        ],
      },
    };
  }
}

// async function callMistralAPI(
//   prompt: string,
//   topics?: string
// ): Promise<FormGeneration> {
//   if (!process.env.MISTRAL_API_KEY) {
//     throw new Error("Missing Mistral API Key in environment variables.");
//   }

//   const apiKey = process.env.MISTRAL_API_KEY;
//   const apiUrl = "https://api.mistral.ai/v1/chat/completions";

//   const formGenerationPrompt = getFormGenPrompt({ prompt, topics });

//   const payload = {
//     model: "mistral-large-latest",
//     messages: [
//       {
//         role: "user",
//         content: `${formGenerationPrompt}\n\nPlease respond with a valid JSON object that matches the required schema.`,
//       },
//     ],
//     response_format: {
//       type: "json_object",
//     },
//     temperature: 0.7,
//     max_tokens: 4096,
//   };

//   const response = await fetch(apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const errorBody = await response.json();
//     console.error(
//       "Mistral API Error Response:",
//       JSON.stringify(errorBody, null, 2)
//     );
//     throw new Error(
//       `Mistral API request failed with status ${response.status}: ${
//         errorBody.message || JSON.stringify(errorBody)
//       }`
//     );
//   }

//   const apiResponse = await response.json();
//   const generatedText = apiResponse.choices?.[0]?.message?.content;
//   if (!generatedText) {
//     throw new Error("Invalid response structure from Mistral API.");
//   }

//   const formData = JSON.parse(generatedText);

//   if (formData.questions && Array.isArray(formData.questions)) {
//     formData.questions = formData.questions.map((q: any) => ({
//       content: q.question_text || q.content || q.text,
//       required: q.required,
//       type: q.field_type || q.type,
//     }));
//   }

//   return formData as FormGeneration;
// }
