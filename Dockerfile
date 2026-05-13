FROM node:18-slim

# Create and set the working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies including dev for the build step
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the project (frontend + server)
RUN npm run build

# Prune dev dependencies after build to keep image small
RUN npm prune --omit=dev

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Use UID 1000 for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user
USER user

# Expose the port
EXPOSE 7860

# Start the server using compiled JS
CMD ["node", "dist/server.js"]
