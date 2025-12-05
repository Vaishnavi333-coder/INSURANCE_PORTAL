# Backend Dockerfile for NestJS with Oracle DB support
# Using oracledb thin mode (no Oracle Instant Client required for oracledb 6.x+)

FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
# Remove sources that cause date validation issues
RUN rm -f /etc/apt/sources.list.d/debian.sources && \
    echo 'deb http://deb.debian.org/debian bookworm main' > /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# oracledb thin mode is default in v6+ and doesn't require Instant Client
# Start the application
CMD ["node", "dist/main"]
