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

# Expose port
EXPOSE 3000

# Deploy app for local development
CMD ["npm", "start"]