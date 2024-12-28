# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# (a) Copy wait-for-it script
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

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

# Start the backend server directly
CMD ["wait-for-it", "$DATABASE_HOST:$DATABASE_PORT", "-t", "30", "--", "npm", "start"]
