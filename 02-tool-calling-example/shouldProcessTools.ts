import { type BaseMessage } from "@langchain/core/messages";

export const shouldProcessTools = async (state: BaseMessage[]) => {
  const lastMessage = state[state.length - 1];
  const toolCalls = lastMessage.additional_kwargs.tool_calls ?? [];
  return toolCalls.length > 0 ? "processTools" : "end";
};
