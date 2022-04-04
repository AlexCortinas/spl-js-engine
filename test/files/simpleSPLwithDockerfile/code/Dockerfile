# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# https://typicode.github.io/husky/#/?id=disable-husky-in-cidocker
RUN npm set-script prepare ""
# If you are building your code for production
RUN npm ci

# Bundle app source
COPY . .

# Changing mongo hostname to use docker
RUN sed -i 's,"hostname": "localhost","hostname": "mongo",g' src/properties.json

EXPOSE #%= data.port #

CMD [ "npm", "start" ]
