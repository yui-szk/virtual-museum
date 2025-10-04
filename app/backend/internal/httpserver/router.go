package httpserver

import (
    "encoding/json"
    "log/slog"
    "net/http"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"

    "backend/internal/config"
    "backend/internal/httpserver/handlers"
    "backend/internal/service"
)

// NewRouter configures chi router, CORS, and registers routes.
func NewRouter(cfg config.Config, log *slog.Logger, itemSvc *service.ItemService, museumSvc *service.MuseumService, artworkSearchSvc *service.ArtworkSearchService) http.Handler {
    r := chi.NewRouter()

    // CORS
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   cfg.AllowedOrigins,
        AllowedMethods:   []string{"GET", "POST", "PATCH", "OPTIONS"},
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
        // GET /items -> list
        api.Get("/items", func(w http.ResponseWriter, r *http.Request) {
            items, err := itemSvc.List()
            if err != nil {
                handlers.RespondError(w, http.StatusInternalServerError, "failed to list items")
                log.Error("list items failed", slog.String("error", err.Error()))
                return
            }
            handlers.RespondJSON(w, http.StatusOK, items)
        })

        // POST /items -> create with basic validation
        type createReq struct {
            Name string `json:"name"`
        }

        api.Post("/items", func(w http.ResponseWriter, r *http.Request) {
            var req createReq
            if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                handlers.RespondError(w, http.StatusBadRequest, "invalid JSON body")
                return
            }
            item, err := itemSvc.Create(req.Name)
            if err != nil {
                handlers.RespondError(w, http.StatusBadRequest, err.Error())
                return
            }
            handlers.RespondJSON(w, http.StatusCreated, item)
        })

        // Met API service and handler
        metSvc := service.NewMetService()
        metHandler := handlers.NewMetHandler(log, metSvc)

        // idから絵画情報取得
        api.Get("/met/objects/{id}", metHandler.GetObjectByID)

        // Museum API
        if museumSvc != nil {
            museumHandler := handlers.NewMuseumHandler(log, museumSvc)
            
            // 1. 公開ミュージアム取得（自分以外）
            api.Get("/museums", museumHandler.GetPublicMuseumsExceptUser)
            
            // 2. ミュージアム詳細取得
            api.Get("/museums/{id}", museumHandler.GetMuseumByID)
            
            // 3. ミュージアムタイトル更新
            api.Patch("/museums/{id}/title", museumHandler.UpdateTitle)
            
            // 4. ミュージアム作成
            api.Post("/museums", museumHandler.Create)
        }

        // 5. 作品検索（MET API）
        if artworkSearchSvc != nil {
            searchHandler := handlers.NewArtworkSearchHandler(log, artworkSearchSvc)
            api.Get("/search/artworks", searchHandler.SearchArtworks)
        }
    })

    return r
}



