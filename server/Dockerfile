FROM node:12

# Set the working directory to /server
WORKDIR /server

# Copy the current directory contents into the container at /server
COPY . /server/

# install dependencies
RUN npm install

# Make port 3030 available to the world outside this container
EXPOSE 3030

# Run the app when the container launches
CMD ["npm", "start"]