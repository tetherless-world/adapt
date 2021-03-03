# policy-tool-frontend


# compile react code in a separate image
FROM node:14-alpine as builder

WORKDIR /app

COPY adapt-ui/package.json ./
RUN npm install --silent

ENV PATH ./node_modules/.bin:$PATH

COPY adapt-ui/ .
RUN npm run build

# production environment
FROM nginx:1-alpine
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]