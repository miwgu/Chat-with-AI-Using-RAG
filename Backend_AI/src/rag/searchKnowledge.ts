import { OllamaEmbedder } from '../embedding/ollama';
import {db} from '../db/db';

export async function searchKnowledge(query: string, topk =3){

    const  embedder = new OllamaEmbedder();
    const queryEmbedding = await embedder.embedText(query);;

    const sql = `
     SELECT content, 1 -(embedding <-> $1) AS distance
     FROM documents
     ORDER BY embedding <-> $1
     LIMIT $2
    `;

    const result = await db.query(sql, [queryEmbedding, topk]);
    return result.rows;
}