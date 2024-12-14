import { startServer } from "./server";
import reader from "readline-sync";

async function main() {
  // start server
  //   startServer();

  console.log("Open Rag is online");
  let inputName = reader.question("Input name: ");

  console.log(`Name: ${inputName}`);
}

main();
