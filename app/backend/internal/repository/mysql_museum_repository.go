package repository

import (
	"database/sql"
	"time"

	"backend/internal/domain"
)

// MuseumRepository はミュージアムのデータアクセス層のインターフェース
type MuseumRepository interface {
	GetPublicMuseumsExcludingUser(excludeUserID int, limit int) ([]domain.Museum, error)
	FindByID(id int) (*domain.Museum, error)
	UpdateTitle(id int, title string) error
	Insert(m domain.Museum) (*domain.Museum, error)
}

// MySQLMuseumRepository はMySQLを使用したMuseumRepositoryの実装
type MySQLMuseumRepository struct {
	db *sql.DB
}

// NewMySQLMuseumRepository は新しいMySQLMuseumRepositoryを作成する
func NewMySQLMuseumRepository(db *sql.DB) MuseumRepository {
	return &MySQLMuseumRepository{db: db}
}

// GetPublicMuseumsExcludingUser は指定ユーザー以外の公開ミュージアムを取得する
func (r *MySQLMuseumRepository) GetPublicMuseumsExcludingUser(excludeUserID int, limit int) ([]domain.Museum, error) {
	query := `
		SELECT id, user_id, name, description, visibility, image_url, created_at
		FROM museums
		WHERE visibility='public' AND user_id <> ?
		ORDER BY id DESC
		LIMIT ?
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
func (r *MySQLMuseumRepository) FindByID(id int) (*domain.Museum, error) {
	query := `
		SELECT id, user_id, name, description, visibility, image_url, created_at
		FROM museums
		WHERE id = ?
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
func (r *MySQLMuseumRepository) UpdateTitle(id int, title string) error {
	query := `UPDATE museums SET name = ? WHERE id = ?`

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
func (r *MySQLMuseumRepository) Insert(m domain.Museum) (*domain.Museum, error) {
	query := `
		INSERT INTO museums (user_id, name, description, visibility, image_url)
		VALUES (?, ?, ?, ?, ?)
	`

	result, err := r.db.Exec(query, m.UserID, m.Name, m.Description, string(m.Visibility), m.ImageURL)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	m.ID = int(id)
	m.CreatedAt = time.Now()

	return &m, nil
}