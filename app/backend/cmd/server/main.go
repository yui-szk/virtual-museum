package main

import (
    "context"
    "database/sql"
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
    _"github.com/go-sql-driver/mysql"
)

// main wires dependencies manually. A wire-ready provider set is also included
// under internal/di for future codegen-based wiring.
func main() {
    cfg := config.Load()
    log := logger.New(cfg.Env)

    // Repository and service wiring
    var repo repository.ItemRepository
    var museumRepo repository.MuseumRepository
    var mysqlDB *sql.DB

    if cfg.DBEnabled {
        dsn := cfg.MySQLDSN()
        if db, err := sql.Open("mysql", dsn); err != nil {
            log.Error("mysql connect failed; falling back to memory", slog.String("error", err.Error()))
            mem := repository.NewInMemoryItemRepository()
            _ = mem.MustSeed("First item", "Second item")
            repo = mem
            // museumRepoはnilのまま（エラーハンドリング用）
        } else {
            // MySQL接続成功時
            if mysqlRepo, err := repository.NewMySQLItemRepository(dsn, cfg.DBMigrate); err != nil {
                log.Error("mysql item repo failed; falling back to memory", slog.String("error", err.Error()))
                mem := repository.NewInMemoryItemRepository()
                _ = mem.MustSeed("First item", "Second item")
                repo = mem
            } else {
                mysqlDB = db
                log.Info("using mysql repository")
                repo = mysqlRepo
            }
            
            // Museum リポジトリの初期化
            museumRepo = repository.NewMySQLMuseumRepository(mysqlDB)
        }
    } else {
        mem := repository.NewInMemoryItemRepository()
        _ = mem.MustSeed("First item", "Second item")
        repo = mem
    }
    svc := service.NewItemService(repo)

    var museumSvc *service.MuseumService
    if museumRepo != nil {
        museumSvc = service.NewMuseumService(museumRepo)
    }
    // Routerは (cfg, log, itemSvc, museumSvc) のシグネチャ
    router := httpserver.NewRouter(cfg, log, svc, museumSvc)


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
    if mysqlDB != nil {
        _ = mysqlDB.Close()
    }
    log.Info("server stopped")
}
