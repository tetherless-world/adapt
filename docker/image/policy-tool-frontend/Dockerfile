# policy-tool-frontend

# compile react code in a separate image
FROM node:12-alpine as build
WORKDIR /policy-tool-frontend
ENV PATH /policy-tool-frontend/node_modules/.bin:$PATH
COPY package.json /policy-tool-frontend/package.json
RUN npm install
RUN npm install react-scripts
COPY policy-tool-frontend /policy-tool-frontend
RUN npm run build

# production environment
FROM nginx:1-alpine
COPY --from=build /js/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]