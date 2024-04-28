import { ChatGroq } from "@langchain/groq";
import { END, MessageGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolExecutor } from "@langchain/langgraph/prebuilt";
import { shouldProcessTools } from "./shouldProcessTools";
import { toolsNode } from "./toolsNode";
import { type BaseMessage } from "@langchain/core/messages";

const searchTool = new TavilySearchResults();
const tools = [searchTool];

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
  temperature: 0,
}).bindTools([searchTool]);

export const toolExecutor = new ToolExecutor({ tools });

const graph = new MessageGraph();

graph.addNode("oracle", async (state: BaseMessage[]) => {
  return llm.invoke(state);
});

graph.addNode("toolsNode", toolsNode(tools));
graph.addConditionalEdges("oracle", shouldProcessTools, {
  processTools: "toolsNode",
  end: END,
});
graph.addEdge("toolsNode", "oracle");
graph.setEntryPoint("oracle");

const runnable = graph.compile();

const res = await runnable.invoke(new HumanMessage("What is sweenystudio?"));

console.log(res);
