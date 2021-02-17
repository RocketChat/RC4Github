FROM node:12

# Set the working directory
WORKDIR /rc4git

# Copy the current directory contents into the container working directory
COPY . /rc4git/

# install dependencies for client
RUN cd client && npm install && cd ../

# install dependencies for server
RUN cd server && npm install

# install PM2
RUN npm install -g pm2

# Make port 8090 available to the world outside this container
EXPOSE 8090

# Run the app when the container launches
CMD ["npm", "run", "prod"]