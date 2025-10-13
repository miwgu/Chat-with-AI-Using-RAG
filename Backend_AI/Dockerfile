FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g ts-node typescript
RUN npm install

COPY . .

# Register knowledge → start server
ENTRYPOINT [ "sh", "-c", "\
  echo 'Running initial knowledge registration...' && \
  npx ts-node src/rag/registerKnowledge.ts && \
  echo 'Starting backend server...' && \
  npx ts-node index.ts" ]
