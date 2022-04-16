FROM node:17-alpine
WORKDIR /usr/src/app

# Copy all the package.json first.
COPY . .

# Install all the dependencies
RUN npm ci

# Build the production image.
RUN npm run build

EXPOSE 3000

CMD [ "node", "./build/index.js" ]