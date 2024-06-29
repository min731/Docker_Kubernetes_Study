# 도커는 레이어 기반 접근 방식

FROM node

WORKDIR /app

# cached 활용을 위해 의존성 설치를 우선으로
# 소스 코드가 변경되더라도 npm install은 변경되지 않아 cached를 사용할 수 있음
COPY package.json /app

RUN npm install

COPY . /app
# COPY . /app 절대경로로 해도 동일

# RUN은 이미지가 생성될 때 실행됌 
# RUN npm install

EXPOSE 80

# 이미지 생성 이후, CMD 레이어 추가
# CMD는 컨테이너가 시작될때 실행됌
CMD ["node", "server.js"]