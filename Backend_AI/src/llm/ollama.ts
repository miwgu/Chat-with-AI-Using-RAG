import { Ollama } from "langchain/llms/ollama";
import { LLMProvider } from "./interface";

export class OllamaLLM implements LLMProvider {
  private model: Ollama;

  constructor(){
    this.model = new Ollama({
       model: process.env.OLLAMA_MODEL ||"lama3:8b", // "lama3:8b" "mistral" 
       baseUrl: process.env.OLLAMA_URL ||"http://host.docker.internal:11434",
    });
  }

  async *stream(prompt: string): AsyncGenerator<string> {
  const stream = await this.model.stream(prompt);

  for await (const chunk of stream) {
    if (typeof chunk === "string"){
      yield chunk;
    } else if (typeof chunk === "object" && "content" in chunk){ // example string "hello" or object { content: "Hello", done: false }
      yield (chunk as any).content;
    }
  }
}
  async invoke(prompt: string): Promise<string> {
    return await this.model.invoke(prompt);
  }

}