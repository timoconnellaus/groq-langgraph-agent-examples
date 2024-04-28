import { type BaseMessage } from "@langchain/core/messages";

// This is the conditional logic to determine if there are any tools to process in the response from Groq
export const shouldProcessTools = async (state: BaseMessage[]) => {
  const lastMessage = state[state.length - 1];
  const toolCalls = lastMessage.additional_kwargs.tool_calls ?? [];
  return toolCalls.length > 0 ? "processTools" : "end";
};
