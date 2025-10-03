//go:build wireinject

package di

import (
    "log/slog"

    "github.com/google/wire"

    "backend/internal/config"
    "backend/internal/httpserver"
    "backend/internal/logger"
    "backend/internal/repository"
    "backend/internal/service"
)

// Provider set for wire code generation. Not required for runtime.
var set = wire.NewSet(
    config.Load,
    logger.New,
    repository.NewInMemoryItemRepository,
    service.NewItemService,
)

// InitializeRouter demonstrates how wire could build the router tree.
func InitializeRouter() (any, *slog.Logger) {
    panic(wire.Build(set, httpserver.NewRouter))
}

