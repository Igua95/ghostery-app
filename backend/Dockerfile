FROM node:18-alpine

# Install OpenSSL and curl for Prisma compatibility and health checks
RUN apk add --no-cache openssl curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]