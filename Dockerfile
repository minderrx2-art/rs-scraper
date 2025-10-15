FROM node:20

# Set working directory to container root
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g ts-node nodemon typescript

# Copy the source code
COPY tsconfig.json /app
COPY . .
# Run npm start
CMD ["npm", "start"]
