FROM node:18-slim

# Create and set the working directory
WORKDIR /app

# Install dependencies needed for some node modules if necessary
# RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Use UID 1000 for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user
USER user

# Expose the port
EXPOSE 7860

# Start the server
CMD ["npm", "start"]
