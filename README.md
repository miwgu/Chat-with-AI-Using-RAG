# AI_Chat_– Fullstack LLM Chatbot

## 📚 Overview

This is a full-stack web application that allows users to interact with a Large Language Model (LLM) through a minimal. Built with React, Express, and LangChain, this app integrates to LLM model mistral from Ollama, answer natural language queries. All interactions are stored in a MySQL database for logging purposes.


---
## ✅ Features
- Minimal chat UI (like ChatGPT)

- Chat history display (oldest → newest)

- Works seamlessly with backend via /api/query and /api/getchatlog

- LLM powered by Mistral via Ollama
> Ollama is a lightweight framework that lets you run large language models (LLMs) locally on your own computer — without relying on cloud APIs like OpenAI’s.

---
## 🚀 Tech Stack

- **Frontend:** React (TypeScript + Vite) — [Frontend Repo](https://github.com/miwgu/AI_Developer_Assistant_Frontend)
- **Backend:** Express.js (TypeScript)
- **LLM Integration:** LangChain + Mistral (via [Ollama](https://ollama.com/))
- **RAG:** Generate and store embeddings with `nomic-embed-text`, retrieve relevant documents using pgvector, and build context prompts for the LLM
- **Database:** PostgreSQL (pgvector)
- **Containerization:** Docker, Docker Compose

---

## ⚙️ Frontend Setup Instructions

1. Clone the Backend Repository
```bash
git clone https://github.com/miwgu/AI_Developer_Assistant_Frontend.git
```
2. Install Dependencies
```bash
npm install
``` 
---

## 🌍Enviroment file
- Add a .env file in the project root
- change settings for Docker or Local 

```bash
#local
#VITE_BACKEND_URL=http://localhost:3000
#Docker
VITE_BACKEND_URL=http://localhost:3001

---

## 💬 How It Works
### User Interaction
- User types a question in the chat input on the frontend.

- Frontend sends a POST request to POST /api/query

- Query is passed to LangChain and Mistral via Ollama.

- The response is returned and saved to the database.

- A GET request to GET /api/getchatlog retrieves all chat logs.

### Features
- LLM-powered responses (offline-capable using Ollama).

- Chat messages are stored in MySQL with UUID-based primary keys.

- Logs are ordered from oldest (top) to newest (bottom) in the UI.

---

## ⚙️ Backend Setup Instructions

1. Clone the Backend Repository
```bash
git clone https://github.com/miwgu/AI_Developer_Assistant_Backend.git
```
2. Install Dependencies
```bash
npm install
```
   
3. Install Ollama

For Windows (WSL2 + Ubuntu)
For Mac (Intel/Apple Silicon)

```bash
curl -fsSL https://ollama.com/install.sh | sh
```
4. Download LLM Model (e.g., Mistral)
```bash
ollama run mistral
```
If using a different model, update the model name in ollama.ts.

---

## 🌍Enviroment file
- Add a .env file in the project root
- change settings for Docker or Local
```bash
#PORT=3000
# FRONTEND_ORIGIN=http://localhost:5173

# Database local settings
#DB_HOST=172.17.112.1
#DB_USER=****
#DB_PASSWORD=****         
#DB_NAME=ai_chat_db2025   
#DB_PORT=3306             


PORT=3000
FRONTEND_ORIGIN=http://localhost:4173
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=mistral
VITE_BACKEND_URL=http://localhost:3000

# Database Docker
DB_HOST=postgres
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=chatdb

```

---

## 🐳Docker Container Setup 

1. Start Containers
```bash
docker-compose up -d --build
```
2. Stop and Remove Containers
```bash
docker-compose down
```
---

## 💾 Database Setup with init.sql
You don’t need to do anything manually to set up the database `chatdb`.  
It is automatically created by `docker-compose.yml`.

The `postgres_data` volume is **persistent**, which means that even if you delete the container, the volume (and thus the database data) will remain. This is why the database may continue to operate with old data.

```yaml
environment:
  - POSTGRES_DB=${DB_NAME}
  - POSTGRES_USER=${DB_USER}
  - POSTGRES_PASSWORD=${DB_PASSWORD}
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```
---

##　🔄 Resetting the Database

If you want to completely delete chatdb and create a new one:
```bash
docker compose down -v && docker compose up -d
```
This will remove both the container and the persistent volume, so the database is recreated from scratch.
---

##　📝 Accessing the Database
Login to the Postgres container (you will need to enter the password):
```bash
docker exec -it aida-postgres-container psql -U myuser -d chatdb
```
Check existing tables:
```bash
\dt  
```


---

## 📈 API Endpoints

| Method | Endpoint        | Description                  | Request Body                    | Response Example                  |
|--------|-----------------|------------------------------|--------------------------------|----------------------------------|
| POST   | /api/query      | Send a question to the LLM   | `{ "question": "string" }`      | `{ "response": "string" }`        |
| GET    | /api/getchatlog | Retrieve all chat history    | None                           | `[ { "id": "uuid", "question": "string", "response": "string", "created_at": "timestamp" }, ... ]` |

---

## 📝 Future Improvements 

- Add user authentication (JWT)
- Delete history entries by ID
- Create and group chat sessions by topic
- Add search functionality in chat logs

