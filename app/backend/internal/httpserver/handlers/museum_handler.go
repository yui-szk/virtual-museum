package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"backend/internal/service"
)

type MuseumHandler struct {
	log       *slog.Logger
	museumSvc *service.MuseumService
}

func NewMuseumHandler(log *slog.Logger, museumSvc *service.MuseumService) *MuseumHandler {
	return &MuseumHandler{
		log:       log,
		museumSvc: museumSvc,
	}
}

// GET /api/v1/museum
func (h *MuseumHandler) Get(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	
	if idParam == "" {
		// Get all museums
		museums, err := h.museumSvc.GetAllMuseums()
		if err != nil {
			h.log.Error("failed to get all museums",
				slog.String("error", err.Error()),
			)
			respondError(w, http.StatusInternalServerError, "failed to get museums")
			return
		}
		
		h.log.Info("retrieved all museums", slog.Int("count", len(museums)))
		respondJSON(w, http.StatusOK, museums)
		return
	}
	
	// Parse museum ID
	museumID, err := strconv.Atoi(idParam)
	if err != nil || museumID <= 0 {
		respondError(w, http.StatusBadRequest, "invalid id")
		return
	}
	
	// Get specific museum by ID
	museum, err := h.museumSvc.GetMuseumByID(museumID)
	if err != nil {
		h.log.Error("failed to get museum",
			slog.String("error", err.Error()),
			slog.Int("museum_id", museumID),
		)
		
		if err.Error() == "museum not found" {
			respondError(w, http.StatusNotFound, "museum not found")
			return
		}
		
		respondError(w, http.StatusInternalServerError, "failed to get museum")
		return
	}
	
	h.log.Info("retrieved museum", 
		slog.Int("museum_id", museumID),
	)
	respondJSON(w, http.StatusOK, museum)
}

// POST /api/v1/museum/{id}/title
func (h *MuseumHandler) UpdateTitle(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		respondError(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req struct {
		Title string `json:"title"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	museum, err := h.museumSvc.UpdateMuseumTitle(id, req.Title)
	if err != nil {
		h.log.Error("failed to update museum title",
			slog.String("error", err.Error()),
			slog.Int("museum_id", id),
			slog.String("title", req.Title),
		)
		
		if err.Error() == "museum not found" {
			respondError(w, http.StatusNotFound, "museum not found")
			return
		}
		if err.Error() == "invalid title" {
			respondError(w, http.StatusBadRequest, "invalid title")
			return
		}
		
		respondError(w, http.StatusInternalServerError, "failed to update museum title")
		return
	}

	h.log.Info("updated museum title",
		slog.Int("museum_id", id),
		slog.String("new_title", req.Title),
	)
	
	// Return simplified response as per spec
	response := map[string]interface{}{
		"id":    museum.ID,
		"title": museum.Name,
		"code":  "met", // Static code as per spec
	}
	
	respondJSON(w, http.StatusOK, response)
}

