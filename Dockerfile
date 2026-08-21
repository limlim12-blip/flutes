#NOTE: https://dev.to/trystan_sarrade/live-reload-and-debugging-go-applications-within-a-docker-container-5d07
# Use the official Golang image as the base image
FROM golang:1.26.4-alpine 

# Set the Current Working Directory inside the container
WORKDIR /app

RUN apk add --no-cache bash curl unzip nodejs npm libstdc++ gcompat
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Install air, used to hot reload the application
RUN go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install github.com/air-verse/air@latest && \
    go install github.com/a-h/templ/cmd/templ@latest

# Copy go mod and sum files and install dependencies
COPY go.mod go.sum ./
COPY pkg/ ./pkg/

RUN go mod download

COPY ./cmd/ ./cmd/
# Switch to root user (if necessary, though it should work, do it only for development purposes)
USER root

# Expose the ports of the container. Docker-Compose do it automatically but it's good to have it here
EXPOSE 2345
EXPOSE 8080

# Run air for live-reload. The -c flag is used to specify the configuration file
CMD ["air", "-c", "air.toml"]
