import { db } from "../db/db";
import { OllamaEmbedder } from "../embedding/ollama";
import {toSql} from "pgvector";

const documents = [
  {
    content: "Mimmi's chick pet is named Piyo.",
    category: "Pet",
    tags: ["chick", "Piyo", "childhood", "animal"]
  },
  {
    content: "When Mimmi was 4 years old, she had a small chick that always followed her around.",
    category: "Pet",
    tags: ["chick", "4 years old", "childhood", "memory"]
  },
  {
    content: "In 2025, Mimmi started keeping a hamster named Koi-chan.",
    category: "Pet",
    tags: ["hamster", "Koi-chan", "2025", "new pet"]
  },
  {
    content: "Koi-chan usually sleeps during the day, often curling up in Mimmi's hand.",
    category: "Pet",
    tags: ["hamster", "Koi-chan", "daytime", "sleep"]
  },
  {
    content: "In the morning, Koi-chan eats cucumber, holding it skillfully with its tiny hands.",
    category: "Pet",
    tags: ["hamster", "Koi-chan", "morning", "food", "cucumber"]
  },
  {
    content: "At night, Koi-chan runs on the hamster wheel starting around 7 PM.",
    category: "Pet",
    tags: ["hamster", "Koi-chan", "night", "exercise", "wheel"]
  },
  {
    content: "Mimmi is a full-stack developer.",
    category: "Career",
    tags: ["full-stack", "developer", "engineer"]
  },
  {
    content: "Mimmi programs using Java, Node.js, React.js, and TypeScript.",
    category: "Career",
    tags: ["Java", "Node.js", "React.js", "TypeScript", "programming"]
  },
  {
    content: "Mimmi recently worked on a full-stack project.",
    category: "Career",
    tags: ["full-stack", "project", "development"]
  },
  {
    content: "Mimmi's hobby is drawing.",
    category: "Hobby",
    tags: ["drawing", "art", "illustration"]
  },
  {
    content: "Mimmi enjoys making small handmade stuffed toys.",
    category: "Hobby",
    tags: ["handmade", "craft", "stuffed toy"]
  },
  {
    content: "Mimmi likes to stay fit and goes to the gym at least once a week.",
    category: "Hobby",
    tags: ["exercise", "gym", "fitness", "weekly"]
  }
];


async function registerKnowledge(){
    console.log("✅ Connecting to DB and Ollama...!")

    const embedder = new OllamaEmbedder();

    for (const doc of documents){
        try{
            console.log(`🧠 Embedding: ${doc.content.slice(0, 30)}..., category: ${doc.category.trim().toLowerCase()}, tags: ${doc.tags.join(', ')}`);
            const embedding = await embedder.embedText(doc.content);

            if(!embedding || !Array.isArray(embedding)){
                console.error("❌ Invalid embedding returned:", embedding);
                continue;
            }

            const vectorSql = toSql(embedding).replace(/\s+/g,''); 
            await db.query(
                `INSERT INTO documents (content, category, tags, embedding) VALUES ($1, $2, $3, $4)`,
                [doc.content, doc.category.trim().toLowerCase(), doc.tags, vectorSql]
            );

            console.log(`✅ Inserted: ${doc.content.slice(0, 40)}...`);
        } catch (err) {
            console.error("❌ Error processing document:", doc.content.slice(0, 40), err);
        }
    }
    console.log("🎉 Knowledge registration complete!");
}

registerKnowledge().catch(console.error);