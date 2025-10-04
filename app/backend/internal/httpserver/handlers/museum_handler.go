package handlers

import (
	"log/slog"
	"net/http"

	"backend/internal/domain"
	"backend/internal/service"
)

type MuseumHandler struct {
	log       *slog.Logger
	museumSvc *service.MuseumService
}

func NewMuseumHandler(log *slog.Logger, museumSvc *service.MuseumService) *MuseumHandler {
	return &MuseumHandler{log: log, museumSvc: museumSvc}
}

// logError はエラーログを出力するヘルパーメソッド
func (h *MuseumHandler) logError(message string, err error, attrs ...slog.Attr) {
	args := []any{slog.String("error", err.Error())}
	for _, attr := range attrs {
		args = append(args, attr)
	}
	h.log.Error(message, args...)
}

// GetPublicMuseumsExceptUser は指定ユーザー以外の公開ミュージアムを取得する
// GET /api/v1/museums?excludeUserId={user_id}&limit=10
func (h *MuseumHandler) GetPublicMuseumsExceptUser(w http.ResponseWriter, r *http.Request) {
	excludeUserID, err := parseRequiredIntQuery(r, "excludeUserId")
	if err != nil {
		HandleError(w, err)
		return
	}

	limit := parseOptionalIntQuery(r, "limit", 10)

	museums, err := h.museumSvc.GetOtherUsersPublicMuseums(excludeUserID, limit)
	if err != nil {
		h.logError("failed to get public museums", err, slog.Int("excludeUserId", excludeUserID), slog.Int("limit", limit))
		HandleError(w, NewInternalServerError("failed to get museums"))
		return
	}

	respondJSON(w, http.StatusOK, museums)
}

// GetMuseumByID は指定IDのミュージアム詳細を取得する
// GET /api/v1/museums/{id}
func (h *MuseumHandler) GetMuseumByID(w http.ResponseWriter, r *http.Request) {
	id, err := parsePositiveIntParam(r, "id")
	if err != nil {
		HandleError(w, err)
		return
	}

	museum, err := h.museumSvc.GetMuseumByID(id)
	if err != nil {
		h.logError("failed to get museum", err, slog.Int("id", id))
		HandleError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, museum)
}

// UpdateTitle はミュージアムのタイトルを更新する
// PATCH /api/v1/museums/{id}/title
func (h *MuseumHandler) UpdateTitle(w http.ResponseWriter, r *http.Request) {
	id, err := parsePositiveIntParam(r, "id")
	if err != nil {
		HandleError(w, err)
		return
	}

	var req domain.MuseumTitleUpdateRequest
	if err := decodeJSONBody(r, &req); err != nil {
		HandleError(w, err)
		return
	}

	if err := validateMuseumTitleUpdateRequest(req); err != nil {
		HandleError(w, err)
		return
	}

	err = h.museumSvc.UpdateTitle(id, req.Title)
	if err != nil {
		h.logError("failed to update museum title", err, slog.Int("id", id), slog.String("title", req.Title))
		HandleError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "title updated successfully"})
}

// Create は新しいミュージアムを作成する
// POST /api/v1/museums
func (h *MuseumHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req domain.MuseumCreateRequest
	if err := decodeJSONBody(r, &req); err != nil {
		HandleError(w, err)
		return
	}

	if err := validateMuseumCreateRequest(req); err != nil {
		HandleError(w, err)
		return
	}

	museum, err := h.museumSvc.Create(req)
	if err != nil {
		h.logError("failed to create museum", err, slog.Int("userId", req.UserID), slog.String("name", req.Name))
		HandleError(w, NewInternalServerError("failed to create museum"))
		return
	}

	respondJSON(w, http.StatusCreated, museum)
}