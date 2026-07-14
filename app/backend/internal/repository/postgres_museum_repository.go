package repository

import (
	"database/sql"

	"backend/internal/domain"
)

// MuseumRepository はミュージアムのデータアクセス層のインターフェース
type MuseumRepository interface {
	GetPublicMuseumsExcludingUser(excludeUserID int, limit int) ([]domain.Museum, error)
	FindByID(id int) (*domain.Museum, error)
	UpdateTitle(id int, title string) error
	Insert(m domain.Museum) (*domain.Museum, error)
}

// PostgresMuseumRepository はPostgreSQLを使用したMuseumRepositoryの実装
type PostgresMuseumRepository struct {
	db *sql.DB
}

// NewPostgresMuseumRepository は新しいPostgresMuseumRepositoryを作成する
func NewPostgresMuseumRepository(db *sql.DB) MuseumRepository {
	return &PostgresMuseumRepository{db: db}
}

// GetPublicMuseumsExcludingUser は指定ユーザー以外の公開ミュージアムを取得する
func (r *PostgresMuseumRepository) GetPublicMuseumsExcludingUser(excludeUserID int, limit int) ([]domain.Museum, error) {
	query := `
		SELECT id, user_id, name, description, visibility, image_url, created_at
		FROM museums
		WHERE visibility='public' AND user_id <> $1
		ORDER BY id DESC
		LIMIT $2
	`

	rows, err := r.db.Query(query, excludeUserID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var museums []domain.Museum
	for rows.Next() {
		var m domain.Museum
		var visibility string
		err := rows.Scan(
			&m.ID,
			&m.UserID,
			&m.Name,
			&m.Description,
			&visibility,
			&m.ImageURL,
			&m.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		m.Visibility = domain.VisibilityType(visibility)
		museums = append(museums, m)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return museums, nil
}

// FindByID は指定IDのミュージアムを取得する
func (r *PostgresMuseumRepository) FindByID(id int) (*domain.Museum, error) {
	query := `
		SELECT id, user_id, name, description, visibility, image_url, created_at
		FROM museums
		WHERE id = $1
	`

	var m domain.Museum
	var visibility string
	err := r.db.QueryRow(query, id).Scan(
		&m.ID,
		&m.UserID,
		&m.Name,
		&m.Description,
		&visibility,
		&m.ImageURL,
		&m.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	m.Visibility = domain.VisibilityType(visibility)
	return &m, nil
}

// UpdateTitle はミュージアムのタイトルを更新する
func (r *PostgresMuseumRepository) UpdateTitle(id int, title string) error {
	query := `UPDATE museums SET name = $1 WHERE id = $2`

	result, err := r.db.Exec(query, title, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// Insert は新しいミュージアムを作成する
func (r *PostgresMuseumRepository) Insert(m domain.Museum) (*domain.Museum, error) {
	query := `
		INSERT INTO museums (user_id, name, description, visibility, image_url)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`

	err := r.db.QueryRow(query, m.UserID, m.Name, m.Description, string(m.Visibility), m.ImageURL).
		Scan(&m.ID, &m.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &m, nil
}
