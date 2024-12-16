import { startServer } from "./server";
import reader from "readline-sync";
import { agent } from "./agent";
import { chat } from "./chat";
import { initAndSeedDatabase, stopDatabase } from "./database";

(async function main() {
  // start server
  //   startServer();

  // init
  await initAndSeedDatabase();

  console.log("Open Rag is online");

  let inputQn: string | null = null;
  //  agent
  // do {
  //   inputQn = reader.question("Input question: ");
  //   if (!inputQn) {
  //     break;
  //   }

  //   // example with a single tool call
  //   const stream = await agent.stream(
  //     {
  //       messages: [{ role: "user", content: inputQn }],
  //     },
  //     {
  //       streamMode: "values",
  //     }
  //   );
  //   for await (const chunk of stream) {
  //     const lastMessage = chunk.messages[chunk.messages.length - 1];
  //     const type = lastMessage._getType();
  //     const content = lastMessage.content;
  //     const toolCalls = lastMessage.tool_calls;
  //     console.dir(
  //       {
  //         type,
  //         content,
  //         toolCalls,
  //       },
  //       { depth: null }
  //     );
  //   }
  // } while (inputQn);

  //  chat
  do {
    inputQn = reader.question("Input question: ");
    if (!inputQn) {
      break;
    }

    const response = await chat.invoke({
      input: inputQn,
    });

    console.log("Response:", response);
  } while (inputQn);
})();

// terminate
process.on("SIGINT", async () => {
  console.log("Open Rag is shutting down");
  await stopDatabase();
  process.exit(1);
});
