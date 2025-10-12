import { saveChatLog } from '../db/chatRepository';
import { OllamaLLM } from '../llm/ollama';
import { searchKnowledge } from '../rag/searchKnowledge';

export async function handleChatQuery(message: string): Promise<AsyncGenerator<string>> {
  
  // RAG search
  const docs = await searchKnowledge(message, 3);
  console.log("📚 Retrieved documents:", docs.map(d => ({ content: d.content, distance: d.distance })));
  const context = docs.length ? docs.map(d => d.content).join("\n") : "No relevant context found.";
  console.log("✅ Context passed to LLM:", context);


  // call LLM
  const ollama = new OllamaLLM();

  // generate prompt
  const prompt = `
You are an AI assistant that uses the following knowledge to answer questions.
Use the context below if relevant. If not, say "I don't have that information."

Context:
${context}

Question:
${message}
`;


  const chunks: string[] = [];
  const stream = ollama.stream(prompt);

  const asyncStream = (async function* () {
    for await (const token of stream) {
      chunks.push(token);
      yield token;
    }

    const fullResponse = chunks.join('');
    try {
      console.log('💾 Saving to DB:', { message, fullResponse });
      await saveChatLog(message, fullResponse);
      console.log('✅ Saved successfully.');
    } catch (err) {
      console.error('❌ Failed to save to DB:', err);
    }
  })();

  return asyncStream;
}