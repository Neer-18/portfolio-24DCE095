# Practical 11: Containerization with Docker
# Supplementary Problem 2: Multi-stage build for React frontend to minimize image size

# Stage 1: Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install full dependencies (including devDependencies like Vite)
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Production Runtime Stage
FROM node:18-alpine

WORKDIR /app

# Copy package definitions and install only runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled production assets from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./

# Expose Vite preview port
EXPOSE 5173

# Serve built bundle accessible on 0.0.0.0
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
