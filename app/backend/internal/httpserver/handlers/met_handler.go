package handlers

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"backend/internal/service"
	"backend/internal/httpserver"
)

type MetHandler struct {
	log    *slog.Logger
	metSvc *service.MetService
}

func NewMetHandler(log *slog.Logger, metSvc *service.MetService) *MetHandler {
	return &MetHandler{log: log, metSvc: metSvc}
}

// GET /api/v1/met/objects/{id}
func (h *MetHandler) GetObjectByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		httpserver.RespondError(w, http.StatusBadRequest, "invalid id")
		return
	}

	obj, err := h.metSvc.GetObjectByID(id)
	if err != nil {
		h.log.Error("MET API error",
			slog.String("error", err.Error()),
			slog.Int("id", id),
		)
		httpserver.RespondError(w, http.StatusBadGateway, fmt.Sprintf("MET API error: %v", err))
		return
	}

	httpserver.RespondJSON(w, http.StatusOK, obj)
}