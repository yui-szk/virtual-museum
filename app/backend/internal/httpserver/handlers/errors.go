package handlers

import (
	"errors"
	"net/http"
)

// HTTPError はHTTPエラーレスポンス用のカスタムエラー型
type HTTPError struct {
	Code    int    `json:"-"`
	Message string `json:"error"`
}

func (e HTTPError) Error() string {
	return e.Message
}

// 定義済みエラー
var (
	ErrInvalidID          = HTTPError{Code: http.StatusBadRequest, Message: "invalid id"}
	ErrInvalidRequestBody = HTTPError{Code: http.StatusBadRequest, Message: "invalid request body"}
	ErrMuseumNotFound     = HTTPError{Code: http.StatusNotFound, Message: "museum not found"}
	ErrInternalServer     = HTTPError{Code: http.StatusInternalServerError, Message: "internal server error"}
)

// NewBadRequestError は400エラーを作成する
func NewBadRequestError(message string) HTTPError {
	return HTTPError{Code: http.StatusBadRequest, Message: message}
}

// NewNotFoundError は404エラーを作成する
func NewNotFoundError(message string) HTTPError {
	return HTTPError{Code: http.StatusNotFound, Message: message}
}

// NewInternalServerError は500エラーを作成する
func NewInternalServerError(message string) HTTPError {
	return HTTPError{Code: http.StatusInternalServerError, Message: message}
}

// HandleError はエラーを適切なHTTPレスポンスに変換する
func HandleError(w http.ResponseWriter, err error) {
	var httpErr HTTPError
	if errors.As(err, &httpErr) {
		respondError(w, httpErr.Code, httpErr.Message)
		return
	}

	// サービス層のエラーメッセージをチェック
	switch err.Error() {
	case "museum not found":
		respondError(w, http.StatusNotFound, "museum not found")
	case "invalid user ID", "invalid museum ID":
		respondError(w, http.StatusBadRequest, err.Error())
	default:
		respondError(w, http.StatusInternalServerError, "internal server error")
	}
}