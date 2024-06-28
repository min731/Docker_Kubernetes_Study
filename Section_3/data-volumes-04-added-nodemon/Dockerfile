FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# VOLUME [ "/app/node_modules" ]

# nodemon을 사용하기 위한 커맨드
CMD [ "npm", "start" ]