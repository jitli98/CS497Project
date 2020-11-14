# Start with a Node.js base image.
FROM node:carbon

# Install dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./views ./views
COPY ./Routes ./Routes
COPY ./Controllers ./Controllers
COPY ./Public ./Public
COPY ./Config ./Config
COPY ./*.js ./

# Declare that the service uses port 3000 internally.
EXPOSE 8000
# Define the command that starts the service.
ENTRYPOINT ["node", "server.js"]