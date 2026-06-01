FROM node:18-slim

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy app source
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "app.js"]
