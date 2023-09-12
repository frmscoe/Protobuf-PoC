# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN NODE_ENV=development npm install

COPY ./src ./src

# Build the project
RUN npm run build

# Custom ENV variables
ENV ITERATIONS=1000
ENV SERVER_URL="0.0.0.0:4222"
ENV DELAY=10
ENV FUNCTION_NAME="Rule001"

CMD ["node", "build/index.js"]
