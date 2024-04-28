// This is an example implementation of the quick start guide for langgraph.js found
// https://js.langchain.com/docs/langgraph#quick-start

import { ChatGroq } from "@langchain/groq";
import { END, MessageGraph } from "@langchain/langgraph";
import { HumanMessage, type BaseMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

const graph = new MessageGraph();

graph.addNode("oracle", async (state: BaseMessage[]) => {
  return llm.invoke(state);
});
graph.addEdge("oracle", END);
graph.setEntryPoint("oracle");
const runnable = graph.compile();

const run = await runnable.invoke(new HumanMessage("What is 1 + 1?"));
console.log(run);
