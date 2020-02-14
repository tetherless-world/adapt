# compile react code in a separate image
FROM node:12-alpine as build
WORKDIR /js
ENV PATH /js/node_modules/.bin:$PATH
COPY package.json /js/package.json
RUN npm install
RUN npm install react-scripts
COPY js /js
RUN npm run build

# production environment
FROM nginx:1-alpine
COPY --from=build /js/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]