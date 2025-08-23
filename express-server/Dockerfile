FROM node:alpine3.22

WORKDIR /app
COPY . .

RUN mkdir screenshots
RUN npm install

EXPOSE 8000

CMD ["sh", "-c", "npm run db:push && npm run dev"]
