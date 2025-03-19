import {
  Annotation,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { Bedrock } from "@langchain/bedrock";

const ChatAgentAnnotation = Annotation.Root({
  messages: MessagesAnnotation.spec["messages"],
});

const graph = new StateGraph(ChatAgentAnnotation)
  .addNode("chat", async (state) => {
    const model = process.env.OPENAI_API_KEY
      ? new ChatOpenAI({
          model: "gpt-4o-mini",
        })
      : new Bedrock({
          model: "amazon-bedrock-model",
        });

    const response = await model.invoke([
      { role: "system", content: "You are a helpful assistant." },
      ...state.messages,
    ]);

    return {
      messages: response,
    };
  })
  .addEdge(START, "chat");

export const agent = graph.compile();
agent.name = "Chat Agent";
