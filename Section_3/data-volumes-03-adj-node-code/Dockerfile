FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# 컨테이너 볼륨 경로, 이름 지정 (*이름 지정 시 컨테이너 삭제에도 유지)
# 익명 볼륨임 , -v 컨테이너볼륨 경로만 지정해서 구현가능
# 익명 볼륨은 도커가 관리
# VOLUME [ "/app/feedback" ] 

CMD [ "node", "server.js" ]