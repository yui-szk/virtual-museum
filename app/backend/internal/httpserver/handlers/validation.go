package handlers

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// parsePositiveIntParam parses a URL parameter as a positive integer
func parsePositiveIntParam(r *http.Request, paramName string) (int, error) {
	paramStr := chi.URLParam(r, paramName)
	param, err := strconv.Atoi(paramStr)
	if err != nil || param <= 0 {
		return 0, err
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
		return 0, err
	}
	return param, nil
}