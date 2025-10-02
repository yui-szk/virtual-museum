package main

import (
    "context"
    "fmt"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "backend/internal/config"
    "backend/internal/httpserver"
    "backend/internal/logger"
    "backend/internal/repository"
    "backend/internal/service"
)

// main wires dependencies manually. A wire-ready provider set is also included
// under internal/di for future codegen-based wiring.
func main() {
    cfg := config.Load()
    log := logger.New(cfg.Env)

    // Repository and service wiring (in-memory for now)
    repo := repository.NewInMemoryItemRepository()
    // Seed a couple of items for convenience in dev
    _ = repo.MustSeed("First item", "Second item")
    svc := service.NewItemService(repo)

    router := httpserver.NewRouter(cfg, log, svc)

    srv := &http.Server{
        Addr:              fmt.Sprintf(":%d", cfg.Port),
        Handler:           router,
        ReadHeaderTimeout: 5 * time.Second,
        ReadTimeout:       10 * time.Second,
        WriteTimeout:      10 * time.Second,
        IdleTimeout:       60 * time.Second,
    }

    go func() {
        log.Info("server starting", slog.Int("port", cfg.Port))
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Error("server error", slog.String("error", err.Error()))
            os.Exit(1)
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Info("shutdown signal received")

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Error("graceful shutdown failed", slog.String("error", err.Error()))
    }
    log.Info("server stopped")
}

