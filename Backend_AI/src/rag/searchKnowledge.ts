import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import {db} from '../db/db';

export async function searchKnowledge(query: string, topk =3){
    const embedder = new OllamaEmbeddings({
      model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
      baseUrl: process.env.OLLAMA_URL || "http://host.docker.internal:11434",
    });
    const queryEmbedding = await embedder.embedQuery(query);

    const sql = `
     SELECT content, 1 -(embedding <-> $1) AS distance
     FROM documents
     ORDER BY embedding <-> $1
     LIMIT $2
    `;

    const result = await db.query(sql, [queryEmbedding, topk]);
    return result.rows;
}