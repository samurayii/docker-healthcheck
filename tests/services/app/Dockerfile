FROM node:14-alpine3.12

COPY app.js /app.js

RUN apk add --no-cache curl

ENTRYPOINT [ "node" ]
CMD [ "/app.js" ]