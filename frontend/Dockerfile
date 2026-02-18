# Dependencies stage
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN [ -f package-lock.json ] && npm ci || npm install

# Development stage
FROM node:22-alpine AS development
# Enable file watching with polling for Docker
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]