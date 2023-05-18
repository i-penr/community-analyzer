# Base image
FROM node:16

# Working directory
WORKDIR /app

# Copy app dependencies to container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Get code
COPY . ./

# Expose port
EXPOSE 8080

RUN npx tsc -p .

# Deploy app for local development
CMD ["npx", "nodemon", "-L", "--watch", ".", "dist/server.js"]