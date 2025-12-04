# Build stage
FROM node:24-alpine AS builder
WORKDIR /app

ARG API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL

COPY package*.json ./
RUN npx next telemetry disable
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
