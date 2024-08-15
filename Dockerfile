# Common - instal dependecies
FROM node:20.10.0 as common-install-step
WORKDIR /usr/project
COPY package.json ./
RUN yarn install

# Service - run service
FROM node:18.18.0 as service-build-step
COPY --from=common-install-step /usr/project /usr/project
WORKDIR /usr/project
COPY tsconfig.json tsconfig.build.json nest-cli.json .prettierrc .prettierignore .eslintrc.js .eslintignore .env ./
COPY ./public/ ./public/
COPY ./packages/ ./packages/
COPY ./shared/ ./shared/
COPY ./services/ ./services/

ENTRYPOINT ["yarn", "service:start"]
CMD ["desk-gateway"]