package handlers

import (
	"fmt"
	"log/slog"
	"net/http"

	"backend/internal/service"
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
	id, err := parsePositiveIntParam(r, "id")
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid id")
		return
	}

	obj, err := h.metSvc.GetObjectByID(id)
	if err != nil {
		h.log.Error("MET API error",
			slog.String("error", err.Error()),
			slog.Int("id", id),
		)
		respondError(w, http.StatusBadGateway, fmt.Sprintf("MET API error: %v", err))
		return
	}

	respondJSON(w, http.StatusOK, obj)
}

