import { type BaseMessage } from "@langchain/core/messages";
import { type AgentAction } from "@langchain/core/agents";

export const getAgentActions = (state: {
  messages: Array<BaseMessage>;
}): AgentAction[] => {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.additional_kwargs.tool_calls ?? [];
  if (toolCalls.length === 0) {
    throw new Error("No tool calls found");
  }
  return toolCalls.map((toolCall) => {
    return {
      tool: toolCall.function.name,
      toolInput: JSON.parse(toolCall.function.arguments),
      log: "",
    };
  });
};
