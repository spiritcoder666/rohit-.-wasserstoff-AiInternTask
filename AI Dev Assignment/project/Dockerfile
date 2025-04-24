FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "--experimental-modules", "server/index.js"]