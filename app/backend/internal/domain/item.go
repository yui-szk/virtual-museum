package domain

import "time"

// Item is a simple domain model for demonstration purposes.
type Item struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    CreatedAt time.Time `json:"createdAt"`
}

