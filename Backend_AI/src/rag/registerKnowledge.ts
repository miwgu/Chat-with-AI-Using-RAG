import { db } from "../db/db";
import { OllamaEmbedder } from "../embedding/ollama";
import {toSql} from "pgvector";

const documents = [
  "Mount Fuji is Japan's highest mountain, standing at 3,776 metres above sea level.",
  "Tokyo is Japan's capital city, featuring numerous skyscrapers and many tourist attractions.",
  "Kyoto retains many historically valuable structures, and in 1994, the “Historic Monuments of Ancient Kyoto” were inscribed as a World Heritage Site.",
  "Mimmi visited Kyoto in 4th April 2023 and explored the Fushimi Inari Shrine, enjoying a hike through the thousands of torii gates.",
  "Yuki walked through the Arashiyama Bamboo Grove in the morning, noting the unique patterns of sunlight and shadow.",
];

async function registerKnowledge(){
    console.log("✅ Connecting to DB and Ollama...!")

    const embedder = new OllamaEmbedder();

    for (const text of documents){
        try{
            console.log(`🧠 Embedding: ${text.slice(0, 30)}...`);
            const embedding = await embedder.embedText(text);

            if(!embedding || !Array.isArray(embedding)){
                console.error("❌ Invalid embedding returned:", embedding);
                continue;
            }

            await db.query(
                `INSERT INTO documents (content, embedding) VALUES ($1, $2)`,
                [text, toSql(embedding)]
            );

            console.log(`✅ Inserted: ${text.slice(0, 40)}...`);
        } catch (err) {
            console.error("❌ Error processing document:", text.slice(0, 40), err);
        }
    }
    console.log("🎉 Knowledge registration complete!");
}

registerKnowledge().catch(console.error);