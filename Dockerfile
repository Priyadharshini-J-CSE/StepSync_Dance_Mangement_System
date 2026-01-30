FROM node:18-alpine

WORKDIR /app

# Copy and install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy and build frontend
COPY frontend/ ./frontend/
RUN cd frontend && chmod +x node_modules/.bin/react-scripts && ./node_modules/.bin/react-scripts build

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy backend source
COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]