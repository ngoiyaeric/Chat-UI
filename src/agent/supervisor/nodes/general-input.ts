import { SupervisorState, SupervisorUpdate } from "../types";
import { ALL_TOOL_DESCRIPTIONS } from "../index";
import { ChatOpenAI } from "@langchain/openai";
import { Bedrock } from "@langchain/bedrock";

export async function generalInput(
  state: SupervisorState,
): Promise<SupervisorUpdate> {
  const GENERAL_INPUT_SYSTEM_PROMPT = `You are an AI assistant.
If the user asks what you can do, describe these tools.
${ALL_TOOL_DESCRIPTIONS}

If the last message is a tool result, describe what the action was, congratulate the user, or send a friendly followup in response to the tool action. Ensure this is a clear and concise message.

Otherwise, just answer as normal.`;

  const llm = process.env.OPENAI_API_KEY
    ? new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 })
    : new Bedrock({ model: "amazon-bedrock-model" });

  const response = await llm.invoke([
    {
      role: "system",
      content: GENERAL_INPUT_SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
}
