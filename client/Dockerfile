FROM node:12

# Set the working directory to /client
WORKDIR /client

# copy current directory contents into the container at /client
COPY . /client/

# install dependencies
RUN npm install

# Make port 8090 available to the world outside this container
EXPOSE 8090

# Run the app when the container launches
CMD ["npm", "start"]