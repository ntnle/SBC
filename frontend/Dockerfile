FROM oven/bun AS build

WORKDIR /frontend

COPY package.json .

RUN bun install

COPY . .

RUN bunx --bun vite build

# 

FROM nginx:alpine

COPY --from=build /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]