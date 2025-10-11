# AI_Chat_Backend & Frontend – Fullstack LLM Chatbot

## 📚 Overview

**AI Dev Assistant** is a full-stack web application that allows users to interact with a Large Language Model (LLM) through a minimal, like ChatGPT-style interface. Built with React, Express, and LangChain, this app integrates to LLM model mistral from Ollama, answer natural language queries. All interactions are stored in a MySQL database for logging purposes.

> This project is part of a fullstack take-home assessment. It demonstrates LLM integration, clean API design, full-stack architecture, and optional Docker + DB implementation.

---
## ✅ Features
- Minimal chat UI (like ChatGPT)

- Chat history display (oldest → newest)

- Works seamlessly with backend via /api/query and /api/getchatlog

- LLM powered by Mistral via Ollama

---
## 🚀 Tech Stack

- **Frontend:** React (TypeScript + Vite) [Frontend](https://github.com/miwgu/AI_Developer_Assistant_Frontend)
- **Backend:** Express.js (TypeScript)
- **LLM Integration:** LangChain + Mistral (via Ollama) [Ollama](https://ollama.com/)
- **Database:** MySQL (with UUID primary keys)
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

## 💾 Database Setup
Login to Postgres container: input password 
```bash
docker exec -it aida-mysql-container mysql -u myuser -p
```
Then run:
```bash
drop database if exists chatdb;
create database chatdb;

USE chatdb;


CREATE TABLE chat_logs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),  
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

To check saved chat
```bash
USE chatdb;
select * from chat_logs;
```

Exit from MySQL
```bash
exit;
```

Displays the logs
```bash
docker logs aida-backend
```
---

## 🧪Run Locally Without Docker
I use Mysql for local database
1.use sql file for create Database
2.Start the backend server:
```bash
npx ts-node src/server/index.ts
```

OR

```bash
chmod +x ./node_modules/.bin/ts-node
./node_modules/.bin/ts-node src/server/index.ts

```
---

## 📈 API Endpoints

| Method | Endpoint        | Description                  | Request Body                    | Response Example                  |
|--------|-----------------|------------------------------|--------------------------------|----------------------------------|
| POST   | /api/query      | Send a question to the LLM   | `{ "question": "string" }`      | `{ "response": "string" }`        |
| GET    | /api/getchatlog | Retrieve all chat history    | None                           | `[ { "id": "uuid", "question": "string", "response": "string", "created_at": "timestamp" }, ... ]` |

---

## 📝 Future Improvements 

- Change to OpenAI　gpt-4.1-nano
- Change to PostgresSQL(pgvector)
- use RAG(Retrieval Augmented Generation)
- Add user authentication (JWT)
- Delete history entries by ID
- Create and group chat sessions by topic
- Add search functionality in chat logs

