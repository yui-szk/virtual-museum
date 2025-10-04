package handlers

import (
    "log/slog"
    "net/http"
    "strconv"

    "backend/internal/service"
)

type MuseumHandler struct {
    log       *slog.Logger
    museumSvc *service.MuseumService
}

func NewMuseumHandler(log *slog.Logger, museumSvc *service.MuseumService) *MuseumHandler {
    return &MuseumHandler{log: log, museumSvc: museumSvc}
}

// GET /api/v1/museums?user_id=1
func (h *MuseumHandler) GetPublicMuseums(w http.ResponseWriter, r *http.Request) {
    // クエリパラメータから除外するユーザーIDを取得
    UserIDStr := r.URL.Query().Get("user_id")
    if UserIDStr == "" {
        respondError(w, http.StatusBadRequest, "user_id parameter is required")
        return
    }

    UserID, err := strconv.Atoi(UserIDStr)
    if err != nil || UserID <= 0 {
        respondError(w, http.StatusBadRequest, "invalid user_id parameter")
        return
    }

    museums, err := h.museumSvc.GetOtherUsersPublicMuseums(UserID)
    if err != nil {
        h.log.Error("failed to get public museums",
            slog.String("error", err.Error()),
            slog.Int("user_id", UserID),
        )
        respondError(w, http.StatusInternalServerError, "failed to get museums")
        return
    }

    respondJSON(w, http.StatusOK, museums)
}