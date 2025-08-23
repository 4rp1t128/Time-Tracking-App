FROM node:alpine3.22

WORKDIR /app

# Copy package.json and install first (cache efficient)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Declare ARG first
ARG NEXT_PUBLIC_BACKEND_BASE_URL

# Also persist as ENV so npm/next can access it
ENV NEXT_PUBLIC_BACKEND_BASE_URL=${NEXT_PUBLIC_BACKEND_BASE_URL}

# Write .env before build
RUN echo "NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL" > .env && cat .env

# Build Next.js with env available
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
