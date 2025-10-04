package domain

import "time"

// テーブル全体
type MuseumToArt struct {
    ID          int       `json:"id"`
    MuseumID    int       `json:"museumId"`
    ObjectID    string    `json:"objectId"`
    Description string    `json:"description"`
    CreatedAt   time.Time `json:"createdAt"`
}

// MuseumToArtCreateRequest represents the request payload for adding an artwork to a museum.
type MuseumToArtCreateRequest struct {
    ObjectID    string `json:"objectId"`
    Description string `json:"description"`
}

// MuseumToArtUpdateRequest represents the request payload for updating artwork info in a museum.
type MuseumToArtUpdateRequest struct {
    Description *string `json:"description,omitempty"` // ポインタで部分更新対応
}

// MuseumToArtResponse represents the response payload for museum-artwork relationship.
type MuseumToArtResponse struct {
    ID          int       `json:"id"`
    MuseumID    int       `json:"museumId"`
    ObjectID    string    `json:"objectId"`
    Description string    `json:"description"`
    CreatedAt   time.Time `json:"createdAt"`
}

// ArtworkInMuseum represents artwork with additional museum-specific information.
type ArtworkInMuseum struct {
    ObjectID          string    `json:"objectId"`
    Description       string    `json:"description"`
    AddedAt          time.Time `json:"addedAt"`
    // 一応？)将来的に外部APIから取得した作品情報も含める可能性
    // Title         string    `json:"title,omitempty"`
    // Artist        string    `json:"artist,omitempty"`
    // ImageURL      string    `json:"imageUrl,omitempty"`
}

// ToResponse converts MuseumToArt to MuseumToArtResponse.
func (mta MuseumToArt) ToResponse() MuseumToArtResponse {
    return MuseumToArtResponse{
        ID:          mta.ID,
        MuseumID:    mta.MuseumID,
        ObjectID:    mta.ObjectID,
        Description: mta.Description,
        CreatedAt:   mta.CreatedAt,
    }
}

// ToArtworkInMuseum converts MuseumToArt to ArtworkInMuseum.
func (mta MuseumToArt) ToArtworkInMuseum() ArtworkInMuseum {
    return ArtworkInMuseum{
        ObjectID:    mta.ObjectID,
        Description: mta.Description,
        AddedAt:     mta.CreatedAt,
    }
}