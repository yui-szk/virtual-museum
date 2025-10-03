package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"backend/internal/domain"
)

// MySQLItemRepository implements ItemRepository backed by MySQL.
type MySQLItemRepository struct {
	db *sql.DB
}

// NewMySQLItemRepository connects to MySQL using the provided DSN. When migrate is true,
// it creates the necessary tables if they do not exist. It retries connections for a short period
// to accommodate container startup order.
func NewMySQLItemRepository(dsn string, migrate bool) (*MySQLItemRepository, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("open mysql: %w", err)
	}

	// Simple retry loop for readiness (up to ~30s)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	for {
		if err = db.PingContext(ctx); err == nil {
			break
		}
		if ctx.Err() != nil {
			return nil, fmt.Errorf("mysql not ready: %w", err)
		}
		time.Sleep(1 * time.Second)
	}

	if migrate {
		if err := ensureSchema(db); err != nil {
			return nil, err
		}
	}

	return &MySQLItemRepository{db: db}, nil
}

func ensureSchema(db *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS items (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return fmt.Errorf("schema: %w", err)
		}
	}
	return nil
}

func (r *MySQLItemRepository) List() ([]domain.Item, error) {
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

func (r *MySQLItemRepository) Create(name string) (domain.Item, error) {
	if name == "" {
		return domain.Item{}, errors.New("name required")
	}
	now := time.Now().UTC()
	res, err := r.db.Exec(`INSERT INTO items (name, created_at) VALUES (?, ?)`, name, now)
	if err != nil {
		return domain.Item{}, err
	}
	id64, err := res.LastInsertId()
	if err != nil {
		return domain.Item{}, err
	}
	return domain.Item{ID: int(id64), Name: name, CreatedAt: now}, nil
}
