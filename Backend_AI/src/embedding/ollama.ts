import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { EmbeddingProvider } from "./interface";

export class OllamaEmbedder implements EmbeddingProvider {
  private model: OllamaEmbeddings;

  constructor() {
    this.model = new OllamaEmbeddings({
        model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
        baseUrl: process.env.OLLAMA_URL ||"http://host.docker.internal:11434",
    })
  }

 async embedText(text: string): Promise< number[]> {
    const result = await this.model.embedQuery(text);

    if(Array.isArray(result[0])){
        return result[0] as number [];
    }
    return result as number[];

 }

}