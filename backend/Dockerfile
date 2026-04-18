# Dockerfile for Imanify Backend
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000
# Start the server using dumb-init for proper signal handling
CMD ["dumb-init", "npm", "start"]

# Health check

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
