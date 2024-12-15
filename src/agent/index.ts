import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { OPENAI_API_KEY, TAVILY_API_KEY } from "../env";

/**
 * tools
 */
const tools = [
  new TavilySearchResults({ maxResults: 3, apiKey: TAVILY_API_KEY }),
];
const toolNode = new ToolNode(tools);

/**
 * model
 */
const model = new ChatOpenAI({
  temperature: 0,
  apiKey: OPENAI_API_KEY,
}).bindTools(tools);

/**
 * should continue condition
 */
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls?.length
  ) {
    return "tools";
  }
  return END;
};

/**
 * call model behaviour
 */
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const response = await model.invoke(messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  // Define the two nodes we will cycle between
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent");

const agent = workflow.compile();

export { agent };
