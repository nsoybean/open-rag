import { startServer } from "./server";
import reader from "readline-sync";
import {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
} from "@langchain/langgraph";
import { agent } from "./graph";

async function main() {
  // start server
  //   startServer();

  console.log("Open Rag is online");

  let inputQn: string | null = null;

  do {
    inputQn = reader.question("Input question: ");
    if (!inputQn) {
      break;
    }

    // example with a single tool call
    const stream = await agent.stream(
      {
        messages: [{ role: "user", content: inputQn }],
      },
      {
        streamMode: "values",
      }
    );
    for await (const chunk of stream) {
      const lastMessage = chunk.messages[chunk.messages.length - 1];
      const type = lastMessage._getType();
      const content = lastMessage.content;
      const toolCalls = lastMessage.tool_calls;
      console.dir(
        {
          type,
          content,
          toolCalls,
        },
        { depth: null }
      );
    }
  } while (inputQn);

  console.log("Ended");
}

main();
