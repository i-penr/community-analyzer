# Base image
FROM node:16-alpine

# Working directory
WORKDIR /app

# Copy app dependencies to container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Get code
COPY . ./

RUN npx tsc -p .

# Expose port
EXPOSE 8080

# Deploy app for local development
CMD ["npm", "start"]