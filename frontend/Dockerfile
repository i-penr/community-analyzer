# Base image
FROM node:16

# Working directory
WORKDIR /usr/src/frontend

# Copy app dependencies to container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Get code
COPY . ./

# Expose port
EXPOSE 3000

# Create cache folder
RUN mkdir ./node_modules/.cache && chmod -R 777 ./node_modules/.cache

# Deploy app for local development
CMD ["npm", "start"]