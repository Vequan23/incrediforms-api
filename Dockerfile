# Use Node.js LTS version
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Enable corepack for yarn support
RUN corepack enable

# Copy yarn specific files
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the server
CMD [ "yarn", "start" ]
