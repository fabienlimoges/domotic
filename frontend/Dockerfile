# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:stable-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
