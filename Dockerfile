# ---------- Etapa 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

# As variáveis VITE_ são embutidas no bundle durante o BUILD, não em tempo de
# execução. Por isso vêm como build args. No Easypanel, defina em Environment.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Dependências primeiro, para aproveitar o cache do Docker
COPY dashboard/package*.json ./dashboard/
WORKDIR /app/dashboard
RUN npm ci

# O código do app e a Constituição, que é embutida no bundle
WORKDIR /app
COPY CONSTITUICAO.md ./
COPY dashboard ./dashboard

WORKDIR /app/dashboard
RUN npm run build

# ---------- Etapa 2: servir ----------
FROM nginx:alpine
COPY --from=build /app/dashboard/dist /usr/share/nginx/html
COPY dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
