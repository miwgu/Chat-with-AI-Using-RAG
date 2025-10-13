FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g ts-node typescript
RUN npm install

COPY . .

# Register knowledge -> Start server
CMD ["/bin/sh", "-c", "npx ts-node src/rag/registerKnowledge.ts && npx ts-node index.ts"]
