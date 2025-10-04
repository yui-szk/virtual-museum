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

// email重複なし、nullなし
func ensureSchema(db *sql.DB) error {
	stmts := []string{
        `CREATE TABLE IF NOT EXISTS items (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
        
		// ユーザー
        `CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            pass_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		// 美術館
		`CREATE TABLE IF NOT EXISTS museums (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            user_id BIGINT NOT NULL,
            name VARCHAR(200) NOT NULL,
            description TEXT,
            visibility ENUM('public', 'private') NOT NULL DEFAULT 'private',
            image_url VARCHAR(500),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            
            INDEX idx_user_id (user_id),
            INDEX idx_visibility (visibility)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		// 美術館と作品の紐付け
		`CREATE TABLE IF NOT EXISTS museums_to_arts (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            museum_id BIGINT NOT NULL,
            object_id BIGINT NOT NULL,
            description TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (museum_id) REFERENCES museums(id) ON DELETE CASCADE,
            
            UNIQUE KEY uk_museum_object (museum_id, object_id),
            
            INDEX idx_museum_id (museum_id),
            INDEX idx_object_id (object_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		// ユーザーのお気に入り作品
        `CREATE TABLE IF NOT EXISTS users_to_arts (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            user_id BIGINT NOT NULL,
            object_id BIGINT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            
            UNIQUE KEY uk_user_object (user_id, object_id),
            
            INDEX idx_user_id (user_id),
            INDEX idx_object_id (object_id),
            INDEX idx_created_at (created_at)
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

// リポジトリ層の実装
// MuseumRepository defines storage operations for Museums.
type MuseumRepository interface {
    GetPublicMuseumsExcludingUser(excludeUserID int) ([]domain.Museum, error)
    // 将来的に他のメソッドも追加予定
    // GetByID(id int) (domain.Museum, error)
    // Create(museum domain.Museum) (domain.Museum, error)
}

// MySQLMuseumRepository implements MuseumRepository backed by MySQL.
type MySQLMuseumRepository struct {
    db *sql.DB
}

func NewMySQLMuseumRepository(db *sql.DB) *MySQLMuseumRepository {
    return &MySQLMuseumRepository{db: db}
}

// GetPublicMuseumsExcludingUser returns public museums excluding the specified user's museums
func (r *MySQLMuseumRepository) GetPublicMuseumsExcludingUser(excludeUserID int) ([]domain.Museum, error) {
    query := `
        SELECT id, user_id, name, description, visibility, image_url, created_at 
        FROM museums 
        WHERE visibility = 'public' AND user_id != ? 
        ORDER BY created_at DESC
    `
    
    rows, err := r.db.Query(query, excludeUserID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var museums []domain.Museum
    for rows.Next() {
        var m domain.Museum
        if err := rows.Scan(&m.ID, &m.UserID, &m.Name, &m.Description, &m.Visibility, &m.ImageURL, &m.CreatedAt); err != nil {
            return nil, err
        }
        museums = append(museums, m)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return museums, nil
}