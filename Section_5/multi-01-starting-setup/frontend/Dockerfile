FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# react 기본 포트는 3000
EXPOSE 3000

# react 실행
CMD ["npm","start"]