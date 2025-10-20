import { saveChatLog } from '../db/chatRepository';
import { OllamaLLM } from '../llm/ollama';
import { searchKnowledge } from '../rag/searchKnowledge';

export async function handleChatQuery(message: string): Promise<AsyncGenerator<string>> {
  const ollama = new OllamaLLM();

  // **RAG search**
  //1 category estimate
  const classifyPrompt = `
   You are a classifier. Categorize the following question wwinto one of these categories:
   ["Pet", "Career", "Hobby"]
   Return ONLY the category name.
   Question: "${message}"
  `;
  const category = (await ollama.invoke(classifyPrompt)).trim();
  const normalizedCategory = category?.trim().toLowerCase() || "general";//if LLM cannot generate category show general
  console.log("🌟 Detected category:", normalizedCategory);

  //2 Category-restricted RAG search
  const docs = await searchKnowledge(message, 5);
  const adjustedDocs = docs.map(d => ({
    ...d,
    score: d.category === normalizedCategory ? d.similarity * 1.2 : d.similarity
  })
 );
  adjustedDocs.sort((a, b) => b.score - a.score);
  
  const topDocs = adjustedDocs.slice(0, 3);
  console.log("📚 Top3_Retrieved documents:",topDocs.map(d=>({content: d.content, similarity: d.similarity, distance: d.distance})));

  //console.log("📚 Retrieved documents:", docs.map(d => ({ content: d.content, distance: d.distance })));
  const context = topDocs.length ? topDocs.map(d => d.content).join("\n") : "No relevant context found.";
  console.log("✅ Context passed to LLM:", context);


  //3 generate answer
  const prompt = `
   You are an AI assistant that uses the following knowledge to answer questions.
   Use the context below if relevant. If not, say "I don't have that information."
   
   Category: 
   ${normalizedCategory}
   
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