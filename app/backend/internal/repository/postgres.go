package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"backend/internal/domain"
)

// PostgresItemRepository implements ItemRepository backed by PostgreSQL.
type PostgresItemRepository struct {
	db *sql.DB
}

// NewPostgresItemRepository connects to PostgreSQL using the provided DSN. When migrate is true,
// it creates the necessary tables if they do not exist. It retries connections for a short period
// to accommodate container startup order.
func NewPostgresItemRepository(dsn string, migrate bool) (*PostgresItemRepository, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}

	// Simple retry loop for readiness (up to ~30s)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	for {
		if err = db.PingContext(ctx); err == nil {
			break
		}
		if ctx.Err() != nil {
			return nil, fmt.Errorf("postgres not ready: %w", err)
		}
		time.Sleep(1 * time.Second)
	}

	if migrate {
		if err := ensureSchema(db); err != nil {
			return nil, err
		}
	}

	return &PostgresItemRepository{db: db}, nil
}

// email重複なし、nullなし
func ensureSchema(db *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS items (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,

		// ユーザー
		`CREATE TABLE IF NOT EXISTS users (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            pass_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,

		// 美術館
		`CREATE TABLE IF NOT EXISTS museums (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(200) NOT NULL,
            description TEXT,
            visibility VARCHAR(10) NOT NULL DEFAULT 'private'
                CHECK (visibility IN ('public', 'private')),
            image_url VARCHAR(500),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,
		`CREATE INDEX IF NOT EXISTS idx_museums_user_id ON museums (user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_museums_visibility ON museums (visibility);`,

		// 美術館と作品の紐付け
		`CREATE TABLE IF NOT EXISTS museums_to_arts (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            museum_id BIGINT NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
            object_id BIGINT NOT NULL,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (museum_id, object_id)
        );`,
		`CREATE INDEX IF NOT EXISTS idx_museums_to_arts_museum_id ON museums_to_arts (museum_id);`,
		`CREATE INDEX IF NOT EXISTS idx_museums_to_arts_object_id ON museums_to_arts (object_id);`,

		// ユーザーのお気に入り作品
		`CREATE TABLE IF NOT EXISTS users_to_arts (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            object_id BIGINT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, object_id)
        );`,
		`CREATE INDEX IF NOT EXISTS idx_users_to_arts_user_id ON users_to_arts (user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_users_to_arts_object_id ON users_to_arts (object_id);`,
		`CREATE INDEX IF NOT EXISTS idx_users_to_arts_created_at ON users_to_arts (created_at);`,
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return fmt.Errorf("schema: %w", err)
		}
	}
	return nil
}

func (r *PostgresItemRepository) List() ([]domain.Item, error) {
	rows, err := r.db.Query(`SELECT id, name, created_at FROM items ORDER BY id ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.Item
	for rows.Next() {
		var it domain.Item
		if err := rows.Scan(&it.ID, &it.Name, &it.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, it)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

func (r *PostgresItemRepository) Create(name string) (domain.Item, error) {
	if name == "" {
		return domain.Item{}, errors.New("name required")
	}
	now := time.Now().UTC()
	var id int64
	err := r.db.QueryRow(
		`INSERT INTO items (name, created_at) VALUES ($1, $2) RETURNING id`,
		name, now,
	).Scan(&id)
	if err != nil {
		return domain.Item{}, err
	}
	return domain.Item{ID: int(id), Name: name, CreatedAt: now}, nil
}
