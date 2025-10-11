import { OllamaEmbedder } from "../embedding/ollama";

async function testEmbedding() {
  const embedder = new OllamaEmbedder();
  const text = "Mount Fuji is the highest mountain in Japan.";
  const vector = await embedder.embedText(text);
  console.log("✅ Embedding length:", vector.length);
}

testEmbedding().catch(console.error);
