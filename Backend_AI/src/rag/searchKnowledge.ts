import { OllamaEmbedder } from '../embedding/ollama';
import {db} from '../db/db';

export async function searchKnowledge(query: string, topk =3){

    const  embedder = new OllamaEmbedder();

    // If you pass something like [0.12, -0.34, 0.56] directly to db.query(),
    // pg will convert it into a Postgres array literal {0.12,-0.34,0.56},
    // which causes an error because pgvector expects a string in the format [0.12,-0.34,0.56].
    const queryEmbedding = await embedder.embedText(query);

    // Convert to a string recognizable by the PostgreSQL vector type
    const vectorString = `[${queryEmbedding.join(",")}]`;// example '[0.1, 0.2, 0.3]'

    const sql = `
     SELECT content, 1 -(embedding <-> $1) AS distance
     FROM documents
     ORDER BY embedding <-> $1
     LIMIT $2
    `;

    const result = await db.query(sql, [vectorString, topk]);
    return result.rows;
}