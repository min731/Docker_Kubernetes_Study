FROM node

WORKDIR /app

COPY . ./
# COPY . /app 절대경로로 해도 동일

# RUN은 이미지가 생성될 때 실행됌 
RUN npm install

EXPOSE 80

# CMD는 컨테이너가 시작될때 실행됌
CMD ["node", "server.js"]