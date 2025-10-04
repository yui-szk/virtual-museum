package httpserver

import (
    "encoding/json"
    "log/slog"
    "net/http"
    "strconv"
    "fmt"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"

    "backend/internal/config"
    "backend/internal/service"
)

// NewRouter configures chi router, CORS, and registers routes.
func NewRouter(cfg config.Config, log *slog.Logger, metSvc *service.MetService) http.Handler {
    r := chi.NewRouter()

	// ---- Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(5 * time.Second))

    // CORS
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   cfg.AllowedOrigins,
        AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: false,
        MaxAge:           300,
    }))

    // Health
    r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
    })

    // API routes
    r.Route("/api/v1", func(api chi.Router) {
        // Handlers
        metHandler := handlers.NewMetHandler(log, metSvc)

        // GET /met/objects/{id}
        api.Get("/met/objects/{id}",metHandler.GetObjectByID)
    })

    return r
}

func respondJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(v)
}

func respondError(w http.ResponseWriter, status int, msg string) {
    respondJSON(w, status, map[string]string{"error": msg})
}

