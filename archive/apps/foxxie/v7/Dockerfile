FROM node:20@sha256:09b38290270d132b895814d9b54602635dbe146ed3ee65b04619922fe4ef6415

WORKDIR /

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json tsconfig.json
COPY ../../.git/ ../../.git/

RUN yarn install

COPY scripts/ scripts/
COPY src/ src/

RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]
