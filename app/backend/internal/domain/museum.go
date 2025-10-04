package domain

import "time"

// 公開非公開を設定
type VisibilityType string

const (
    VisibilityPublic  VisibilityType = "public"
    VisibilityPrivate VisibilityType = "private"
)

// Museumのデータベース
type Museum struct {
    ID          int            `json:"id"`
    UserID      int            `json:"userId"`
    Name        string         `json:"name"`
    Description string         `json:"description"`
    Visibility  VisibilityType `json:"visibility"`
    ImageURL    string         `json:"imageUrl"`
    CreatedAt   time.Time      `json:"createdAt"`
}

// MuseumCreateRequest represents the request payload for creating a museum.
type MuseumCreateRequest struct {
    Name        string         `json:"name"`
    Description string         `json:"description"`
    Visibility  VisibilityType `json:"visibility"`
    ImageURL    string         `json:"imageUrl"`
}

// MuseumUpdateRequest represents the request payload for updating a museum.
type MuseumUpdateRequest struct {
    Name        *string         `json:"name,omitempty"`        // ポインタで部分更新対応
    Description *string         `json:"description,omitempty"`
    Visibility  *VisibilityType `json:"visibility,omitempty"`
    ImageURL    *string         `json:"imageUrl,omitempty"`
}

// MuseumResponse represents the response payload for museum data.
type MuseumResponse struct {
    ID          int            `json:"id"`
    UserID      int            `json:"userId"`
    Name        string         `json:"name"`
    Description string         `json:"description"`
    Visibility  VisibilityType `json:"visibility"`
    ImageURL    string         `json:"imageUrl"`
    CreatedAt   time.Time      `json:"createdAt"`
}

// ToResponse converts Museum to MuseumResponse.
func (m Museum) ToResponse() MuseumResponse {
    return MuseumResponse{
        ID:          m.ID,
        UserID:      m.UserID,
        Name:        m.Name,
        Description: m.Description,
        Visibility:  m.Visibility,
        ImageURL:    m.ImageURL,
        CreatedAt:   m.CreatedAt,
    }
}

// IsPublic returns true if the museum is public.
func (m Museum) IsPublic() bool {
    return m.Visibility == VisibilityPublic
}

// IsOwnedBy returns true if the museum is owned by the specified user.
func (m Museum) IsOwnedBy(userID int) bool {
    return m.UserID == userID
}