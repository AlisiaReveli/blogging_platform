# Use a Node.js base image
FROM node:15-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your NestJS application runs
EXPOSE 3000

# Command to run your NestJS application
CMD ["npm", "start"]
