import { FunctionMessage, type BaseMessage } from "@langchain/core/messages";
import { getAgentActions } from "./getAgentActions";
import type { StructuredTool } from "langchain/tools";
import { ToolExecutor } from "@langchain/langgraph/prebuilt";

export const toolsNode = (tools: Array<StructuredTool>) => {
  const toolExecutor = new ToolExecutor({ tools });

  const toolsNodeFunc = async (state: BaseMessage[]) => {
    const lastMessage = state[state.length - 1];
    const toolCalls = lastMessage.additional_kwargs.tool_calls ?? [];
    if (toolCalls.length === 0) {
      throw new Error("No tool calls found");
    }
    const actions = getAgentActions({ messages: state });

    const responses = await Promise.all(
      actions.map((action) => {
        return toolExecutor.invoke(action);
      })
    );

    const functionMessages = responses.map((response, index) => {
      return new FunctionMessage({
        content: response,
        name: actions[index].tool,
      });
    });

    return functionMessages;
  };

  return toolsNodeFunc;
};
