package handlers

import (
	"encoding/json"
	"net/http"
)

// RespondJSON sends a JSON response with the given status code and data
func RespondJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// RespondError sends a JSON error response
func RespondError(w http.ResponseWriter, status int, msg string) {
	RespondJSON(w, status, map[string]string{"error": msg})
}

// respondJSON sends a JSON response with the given status code and data (internal use)
func respondJSON(w http.ResponseWriter, status int, v any) {
	RespondJSON(w, status, v)
}

// respondError sends a JSON error response (internal use)
func respondError(w http.ResponseWriter, status int, msg string) {
	RespondError(w, status, msg)
}