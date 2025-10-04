package domain

import "time"

// UsersToArt represents a Users's favorite artwork.
type UsersToArt struct {
    ID        int       `json:"id"`
    UserID    int       `json:"userId"`
    ObjectID  int       `json:"objectId"`
    CreatedAt time.Time `json:"createdAt"`
}

// UsersToArtCreateRequest represents the request payload for adding an artwork to favorites.
type UsersToArtCreateRequest struct {
    ObjectID int `json:"objectId"`
}

// UsersToArtResponse represents the response payload for user's favorite artwork.
type UsersToArtResponse struct {
    ID        int       `json:"id"`
    UserID    int       `json:"userId"`
    ObjectID  int       `json:"objectId"`
    CreatedAt time.Time `json:"createdAt"`
}

// FavoriteArtwork represents a favorite artwork with potential additional info.
type FavoriteArtwork struct {
    ObjectID    int       `json:"objectId"`
    FavoritedAt time.Time `json:"favoritedAt"`
    // 将来的に外部APIから取得した作品情報も含める可能性
    // Title         string    `json:"title,omitempty"`
    // Artist        string    `json:"artist,omitempty"`
    // ImageURL      string    `json:"imageUrl,omitempty"`
    // MuseumName    string    `json:"museumName,omitempty"`
}

// UsersFavoritesResponse represents a user's complete favorites list.
type UserFavoritesResponse struct {
    UserID    int               `json:"userId"`
    Total     int               `json:"total"`
    Favorites []FavoriteArtwork `json:"favorites"`
}

// ToResponse converts UsersToArt to UsersToArtResponse.
func (uta UsersToArt) ToResponse() UsersToArtResponse {
    return UsersToArtResponse{
        ID:        uta.ID,
        UserID:    uta.UserID,
        ObjectID:  uta.ObjectID,
        CreatedAt: uta.CreatedAt,
    }
}

// ToFavoriteArtwork converts UsersToArt to FavoriteArtwork.
func (uta UsersToArt) ToFavoriteArtwork() FavoriteArtwork {
    return FavoriteArtwork{
        ObjectID:    uta.ObjectID,
        FavoritedAt: uta.CreatedAt,
    }
}

// IsFavoritedBy checks if the artwork is favorited by the specified user.
// This is a helper method for checking favorite status.
func (uta UsersToArt) IsFavoritedBy(userID int) bool {
    return uta.UserID == userID
}