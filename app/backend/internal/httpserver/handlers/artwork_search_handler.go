package handlers

import (
	"log/slog"
	"net/http"
	"strconv"

	"backend/internal/domain"
	"backend/internal/service"
)

type ArtworkSearchHandler struct {
	log        *slog.Logger
	searchSvc  *service.ArtworkSearchService
}

func NewArtworkSearchHandler(log *slog.Logger, searchSvc *service.ArtworkSearchService) *ArtworkSearchHandler {
	return &ArtworkSearchHandler{log: log, searchSvc: searchSvc}
}

// logError はエラーログを出力するヘルパーメソッド
func (h *ArtworkSearchHandler) logError(message string, err error, attrs ...slog.Attr) {
	args := []any{slog.String("error", err.Error())}
	for _, attr := range attrs {
		args = append(args, attr)
	}
	h.log.Error(message, args...)
}

// SearchArtworks はMET APIを使用して作品を検索する
// GET /api/v1/search/artworks?isHighlight=true&objectDate=1870&city=Paris&medium=Oil
func (h *ArtworkSearchHandler) SearchArtworks(w http.ResponseWriter, r *http.Request) {
	query := h.parseArtworkSearchQuery(r)
	limit := parseOptionalIntQuery(r, "limit", 20)

	result, err := h.searchSvc.SearchArtworks(query, limit)
	if err != nil {
		h.logError("failed to search artworks", err, slog.Any("query", query))
		HandleError(w, NewInternalServerError("failed to search artworks"))
		return
	}

	respondJSON(w, http.StatusOK, result)
}

// parseArtworkSearchQuery はリクエストから検索クエリを解析する
func (h *ArtworkSearchHandler) parseArtworkSearchQuery(r *http.Request) domain.ArtworkSearchQuery {
	query := domain.ArtworkSearchQuery{}

	// isHighlightパラメータ
	if isHighlightStr := r.URL.Query().Get("isHighlight"); isHighlightStr != "" {
		if isHighlight, err := strconv.ParseBool(isHighlightStr); err == nil {
			query.IsHighlight = &isHighlight
		}
	}

	// その他のパラメータ
	query.ObjectDate = r.URL.Query().Get("objectDate")
	query.City = r.URL.Query().Get("city")
	query.Medium = r.URL.Query().Get("medium")

	return query
}