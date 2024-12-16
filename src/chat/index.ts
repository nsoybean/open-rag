import { ChatOpenAI } from "@langchain/openai";
import { OPENAI_API_KEY } from "../env";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOpenAI({
  temperature: 0,
  apiKey: OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful AI brand marketer assistant that helps me to create social media content.",
  ],
  ["human", "{input}"],
]);

const chat = prompt.pipe(llm);

export { chat };
