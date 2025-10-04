package domain

import "time"

// Userデータベース操作用
type User struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    PassHash  string    `json:"-"` // パスワードハッシュはJSONレスポンスに含めない
    CreatedAt time.Time `json:"createdAt"`
}

// ユーザー作成用
type UserCreateRequest struct {
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

// パスワードは含めずにレスポンス用に変換
type UserResponse struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"createdAt"`
}

// ToResponse converts User to UserResponse (excluding sensitive data).
func (u User) ToResponse() UserResponse {
    return UserResponse{
        ID:        u.ID,
        Name:      u.Name,
        Email:     u.Email,
        CreatedAt: u.CreatedAt,
    }
}