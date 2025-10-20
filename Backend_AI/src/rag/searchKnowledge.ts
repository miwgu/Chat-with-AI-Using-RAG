import { OllamaEmbedder } from '../embedding/ollama';
import {toSql} from "pgvector";
import {db} from '../db/db';

export async function searchKnowledge(query: string, topk =3){

    const  embedder = new OllamaEmbedder();

    // If you pass something like [0.12, -0.34, 0.56] directly to db.query(),
    // pg will convert it into a Postgres array literal {0.12,-0.34,0.56},
    // which causes an error because pgvector expects a string in the format [0.12,-0.34,0.56].
    const queryEmbedding = await embedder.embedText(query);

    // Convert to a string recognizable by the PostgreSQL vector type and remove whitespace
    const vectorSql = toSql(queryEmbedding).replace(/\s+/g,''); // example '[0.1, 0.2, 0.3]'

    console.log("Query embedding (first 5 dims):", queryEmbedding.slice(0,5));

    let sql: string;
    let params: any[];

    sql = `
       SELECT content, category,
       1.0 / (1.0 + (embedding <-> $1::vector)) AS similarity,
       embedding <-> $1::vector AS distance
       FROM documents
       ORDER BY similarity DESC
       LIMIT $2::int;
    `;

    params = [vectorSql, topk];

    //console.log("🧭 Category param:", category);
    console.log("🧭 Vector length:", queryEmbedding.length);
    const result = await db.query(sql, params);
    console.log("📊 Found rows:", result.rowCount);
    console.log("🗂 Rows:", result.rows);
    return result.rows;
}