<p align="center">
  <a href="https://otcmarsbase.com/" target="blank"><img src="public/marsbase-logo.png" width="200" alt="Marsbase Logo" /></a>
</p>

<p align="center">SAFT / SAFE Product - Backend NestJS (Typescript).</p>
<p align="center">
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
</p>

## Description

[OTC MARSBASE](https://github.com/nestjs/nest) NestJS TypeScript backend for SAFT/SAFE Product.

## Installation

```bash
$ yarn install
```

## Run DEV infra services

Services:

- Redis
- Bull Dashboard
- Postgres
- Nats Cluster (3 nodes)

```bash
# Run docker-compose
$ docker-compose -f compose/infra.docker-compose.yml up -d
```

## Running the app

```bash
# watch mode
$ yarn service:dev <service_name>

# example: yarn service:dev desk-gateway

# production mode
$ yarn service:prod <service_name>
```
