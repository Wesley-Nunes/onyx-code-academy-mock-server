# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads

USER node

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
