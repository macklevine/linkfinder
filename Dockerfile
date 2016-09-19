FROM movoto/node:alpine-5.0.0

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app/

RUN npm cache clean && npm install && node_modules/gulp/bin/gulp.js release

EXPOSE 8080

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

CMD node_modules/pm2/bin/pm2 --no-daemon start server/app.js -i 0
