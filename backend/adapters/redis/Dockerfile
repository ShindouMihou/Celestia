FROM node:17-alpine
WORKDIR /usr/src/app

COPY . .

# Install all the dependencies
RUN npm i autoprefixer
RUN npm ci --only=production

CMD [ "node", "./src/index.js" ]