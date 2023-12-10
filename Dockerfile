FROM node:20-alpine

WORKDIR /app

#copy all the files
COPY package.json yarn.lock ./

# install node dependency and build project
RUN yarn global add dotenv-cli
RUN yarn install

COPY . .

RUN yarn run build

# receive NODE_ENV from docker build cmds.
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

# container port
EXPOSE 4000

# run on container start command
ENTRYPOINT ["yarn", "run", "start"]
