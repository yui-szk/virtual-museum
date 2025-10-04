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

// GET /api/v1/museums?exclude_user_id=1
func (h *MuseumHandler) GetPublicMuseums(w http.ResponseWriter, r *http.Request) {
    // クエリパラメータから除外するユーザーIDを取得
    excludeUserIDStr := r.URL.Query().Get("exclude_user_id")
    if excludeUserIDStr == "" {
        respondError(w, http.StatusBadRequest, "exclude_user_id parameter is required")
        return
    }

    excludeUserID, err := strconv.Atoi(excludeUserIDStr)
    if err != nil || excludeUserID <= 0 {
        respondError(w, http.StatusBadRequest, "invalid exclude_user_id parameter")
        return
    }

    museums, err := h.museumSvc.GetOtherUsersPublicMuseums(excludeUserID)
    if err != nil {
        h.log.Error("failed to get public museums",
            slog.String("error", err.Error()),
            slog.Int("exclude_user_id", excludeUserID),
        )
        respondError(w, http.StatusInternalServerError, "failed to get museums")
        return
    }

    respondJSON(w, http.StatusOK, museums)
}