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

# Add wait-for-it script
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Start the backend server with wait-for-it
CMD ["wait-for-it", "db:5432", "--", "npm", "start"]

