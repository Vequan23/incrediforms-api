# Use Node.js LTS version
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install yarn if not included in base image
RUN npm install -g yarn

# Copy yarn specific files
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start the server
CMD [ "yarn", "start" ]
