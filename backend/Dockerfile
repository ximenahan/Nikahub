# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Build the backend
RUN npm run build

# Expose the backend's listening port (e.g., 3001)
EXPOSE 3001

# Start the backend server
CMD ["npm", "start"]

