# Start with a Node.js base image.
FROM node:carbon

# Install dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./Routes ./Routes
COPY ./Controllers ./Controllers
COPY ./Config ./Config
COPY ./*.js ./

# Declare that the service uses port 3000 internally.
EXPOSE 9000
# Define the command that starts the service.
ENTRYPOINT ["node", "server.js"]