FROM node:16-alpine AS backend-builder
# # Set working directory
WORKDIR /app
COPY ./backend/package*.json /app/
COPY ./backend .

FROM node:16-alpine AS frontend-builder
# # # Set working directory
WORKDIR /app
COPY frontend/package*.json /app
COPY ./frontend .

# # Set base image for final image
FROM node:16-alpine

# Install required dependencies
RUN npm install -g serve

# # Set working directory for final image
WORKDIR /app
RUN mkdir /app/backend
RUN mkdir /app/frontend

# # Copy the built backend and frontend files to the working directory
COPY --from=backend-builder /app/. /app/backend/
COPY --from=frontend-builder /app/. /app/frontend/

RUN npm install --prefix /app/backend
RUN npm install --prefix /app/frontend
# # Expose backend and frontend ports (replace 8000 with your actual backend port)
EXPOSE 8000
EXPOSE 3000

CMD ["sh", "-c", "cd backend && npm run start-prod & cd frontend && npm run start-prod & wait"]