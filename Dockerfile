#NOTE: https://dev.to/trystan_sarrade/live-reload-and-debugging-go-applications-within-a-docker-container-5d07
# Use the official Golang image as the base image
FROM golang:1.26.4-alpine 

# Set the Current Working Directory inside the container
WORKDIR /app

# Install delve, used to debug the application (golang doesn't have a built-in debugger)
RUN go install github.com/go-delve/delve/cmd/dlv@latest

# Install air, used to hot reload the application
RUN go install github.com/air-verse/air@latest

# Copy go mod and sum files and install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Switch to root user (if necessary, though it should work, do it only for development purposes)
USER root

# Expose the ports of the container. Docker-Compose do it automatically but it's good to have it here
EXPOSE 2345
EXPOSE 8080

# Run air for live-reload. The -c flag is used to specify the configuration file
CMD ["air", "-c", "air.toml"]
