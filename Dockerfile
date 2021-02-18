FROM node:14

# Set the working directory
WORKDIR /rc4git/server

# Copy the current directory contents into the container working directory
COPY . /rc4git/

# install dependencies for client
RUN npm install --prefix ../client

# install dependencies for server
RUN npm install

# Make port 8090 available to the world outside this container
EXPOSE 8090

# Run the app when the container launches
CMD ["npm", "run", "prod"]