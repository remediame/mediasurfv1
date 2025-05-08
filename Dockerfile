FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
