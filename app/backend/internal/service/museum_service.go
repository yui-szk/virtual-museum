package service

import (
	"database/sql"
	"errors"
	"strings"

	"backend/internal/domain"
)

// MuseumService contains business logic for Museums and validates inputs.
type MuseumService struct {
	db *sql.DB
}

func NewMuseumService(db *sql.DB) *MuseumService {
	return &MuseumService{
		db: db,
	}
}

// GetAllMuseums gets all museums from the database
func (s *MuseumService) GetAllMuseums() ([]domain.Museum, error) {
	if s.db == nil {
		return []domain.Museum{}, nil
	}
	
	query := `SELECT id, user_id, name, description, visibility, image_url, created_at 
			  FROM museums ORDER BY id ASC`
	
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var museums []domain.Museum
	for rows.Next() {
		var museum domain.Museum
		err := rows.Scan(
			&museum.ID,
			&museum.UserID,
			&museum.Name,
			&museum.Description,
			&museum.Visibility,
			&museum.ImageURL,
			&museum.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		museums = append(museums, museum)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return museums, nil
}

// GetMuseumByID gets a museum by ID
func (s *MuseumService) GetMuseumByID(id int) (*domain.Museum, error) {
	if s.db == nil {
		return nil, errors.New("museum not found")
	}
	
	query := `SELECT id, user_id, name, description, visibility, image_url, created_at 
			  FROM museums WHERE id = ?`
	
	var museum domain.Museum
	err := s.db.QueryRow(query, id).Scan(
		&museum.ID,
		&museum.UserID,
		&museum.Name,
		&museum.Description,
		&museum.Visibility,
		&museum.ImageURL,
		&museum.CreatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("museum not found")
		}
		return nil, err
	}
	
	return &museum, nil
}

// UpdateMuseumTitle updates the title (name) of a museum
func (s *MuseumService) UpdateMuseumTitle(id int, title string) (*domain.Museum, error) {
	if s.db == nil {
		return nil, errors.New("museum not found")
	}
	
	title = strings.TrimSpace(title)
	if title == "" {
		return nil, errors.New("invalid title")
	}
	if len(title) > 200 {
		return nil, errors.New("invalid title")
	}

	// Check if museum exists
	museum, err := s.GetMuseumByID(id)
	if err != nil {
		return nil, err
	}

	// Update the title
	query := `UPDATE museums SET name = ? WHERE id = ?`
	_, err = s.db.Exec(query, title, id)
	if err != nil {
		return nil, err
	}

	// Return updated museum
	museum.Name = title
	return museum, nil
}