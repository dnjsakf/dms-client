# 베이스 이미지로 Nginx 사용
FROM docker.io/nginx:1.27.1-alpine-perl

# build.tar 파일을 해당 경로에 추출(압축해제)
ADD build.tar /usr/local/nginx/html

# 사용권한 수정
RUN chmod -R 755 /usr/local/nginx/html

# server.conf 파일을 복사
COPY server.conf /etc/nginx/conf.d/default.conf

# 애플리케이션이 80 포트를 사용
EXPOSE 80
