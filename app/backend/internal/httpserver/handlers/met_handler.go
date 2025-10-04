package handlers

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

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
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
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

func respondJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func respondError(w http.ResponseWriter, status int, msg string) {
	respondJSON(w, status, map[string]string{"error": msg})
}