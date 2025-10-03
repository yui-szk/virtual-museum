# syntax=docker/dockerfile:1

# Dev stage with hot reload (air)
FROM golang:1.25.1-alpine AS dev
WORKDIR /app

# Utilities for dev + healthcheck
RUN apk add --no-cache git bash build-base wget curl ca-certificates

# Ensure Go-installed tools are on PATH
ENV PATH="/go/bin:/usr/local/go/bin:${PATH}" \
    GOPATH=/go \
    GO111MODULE=on
# Build tools without CGO to avoid needing system linker `ld` on Alpine
RUN CGO_ENABLED=0 go install github.com/air-verse/air@latest \
    && CGO_ENABLED=0 go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Cache dependencies
COPY go.mod ./
RUN go mod download

COPY . .

EXPOSE 8080
CMD ["air", "-c", ".air.toml"]

# Build stage for production (optional)
FROM golang:1.25.1-alpine AS build
WORKDIR /app
COPY --link . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/server

# Minimal runtime image
FROM gcr.io/distroless/base-debian12:nonroot AS prod
WORKDIR /app
COPY --from=build /app/server /app/server
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/server"]
