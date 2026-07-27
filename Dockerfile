# ---------- Etapa 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

# As variáveis VITE_ são embutidas no bundle durante o BUILD, não em tempo de execução.
# Por isso precisam vir como build args. No Easypanel, configure em Environment.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Etapa 2: servir ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
