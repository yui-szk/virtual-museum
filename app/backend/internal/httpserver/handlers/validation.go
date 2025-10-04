package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"backend/internal/domain"
)

// parsePositiveIntParam parses a URL parameter as a positive integer
func parsePositiveIntParam(r *http.Request, paramName string) (int, error) {
	paramStr := chi.URLParam(r, paramName)
	param, err := strconv.Atoi(paramStr)
	if err != nil || param <= 0 {
		return 0, ErrInvalidID
	}
	return param, nil
}

// parsePositiveIntQuery parses a query parameter as a positive integer
func parsePositiveIntQuery(r *http.Request, paramName string) (int, error) {
	paramStr := r.URL.Query().Get(paramName)
	if paramStr == "" {
		return 0, nil // クエリパラメータが空の場合は0を返す
	}
	param, err := strconv.Atoi(paramStr)
	if err != nil || param <= 0 {
		return 0, NewBadRequestError("invalid " + paramName + " parameter")
	}
	return param, nil
}

// parseRequiredIntQuery parses a required query parameter as a positive integer
func parseRequiredIntQuery(r *http.Request, paramName string) (int, error) {
	paramStr := r.URL.Query().Get(paramName)
	if paramStr == "" {
		return 0, NewBadRequestError(paramName + " parameter is required")
	}
	param, err := strconv.Atoi(paramStr)
	if err != nil || param <= 0 {
		return 0, NewBadRequestError("invalid " + paramName + " parameter")
	}
	return param, nil
}

// parseOptionalIntQuery parses an optional query parameter with default value
func parseOptionalIntQuery(r *http.Request, paramName string, defaultValue int) int {
	paramStr := r.URL.Query().Get(paramName)
	if paramStr == "" {
		return defaultValue
	}
	if param, err := strconv.Atoi(paramStr); err == nil && param > 0 {
		return param
	}
	return defaultValue
}

// decodeJSONBody decodes JSON request body
func decodeJSONBody(r *http.Request, dst interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		return ErrInvalidRequestBody
	}
	return nil
}

// validateMuseumCreateRequest validates museum create request
func validateMuseumCreateRequest(req domain.MuseumCreateRequest) error {
	if req.UserID <= 0 {
		return NewBadRequestError("userId is required")
	}
	if req.Name == "" {
		return NewBadRequestError("name is required")
	}
	return nil
}

// validateMuseumTitleUpdateRequest validates museum title update request
func validateMuseumTitleUpdateRequest(req domain.MuseumTitleUpdateRequest) error {
	if req.Title == "" {
		return NewBadRequestError("title is required")
	}
	return nil
}