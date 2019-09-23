# stage 1
FROM node:latest as node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app/
RUN npm run build

# stage 2
FROM nginx:alpine
COPY --from=node /app/dist/prd/ /usr/share/nginx/html/
COPY --from=node /app/nginx.conf /etc/nginx/conf.d/default.conf
