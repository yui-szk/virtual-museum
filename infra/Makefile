SHELL := /bin/bash

.PHONY: up down logs ps restart lint fmt test mod-tidy

# Service names (can be overridden: `make -C infra SERVICE_BACKEND=...`)
SERVICE_BACKEND ?= app-backend
SERVICE_FRONTEND ?= app-frontend

up:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose up --build

down:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose down -v --remove-orphans

logs:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose logs -f --tail=200

ps:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose ps

restart:
	$(MAKE) down && $(MAKE) up

lint:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_BACKEND) golangci-lint run --timeout=3m || true
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_FRONTEND) npm run lint || true

fmt:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_BACKEND) go fmt ./...
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_FRONTEND) npm run format

test:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_BACKEND) go test ./...
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_FRONTEND) npm test -- --run

mod-tidy:
	cd $(dir $(lastword $(MAKEFILE_LIST))) && docker compose exec $(SERVICE_BACKEND) sh -lc 'cd /app && go mod tidy'
