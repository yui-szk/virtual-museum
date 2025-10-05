package service

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"time"

	"backend/internal/domain"
	"backend/internal/repository"
)

// MuseumService はミュージアムのビジネスロジックを含む
type MuseumService struct {
	repo repository.MuseumRepository
}

// NewMuseumService は新しいMuseumServiceを作成する
func NewMuseumService(repo repository.MuseumRepository) *MuseumService {
	return &MuseumService{repo: repo}
}

// GetOtherUsersPublicMuseums は指定ユーザー以外の公開ミュージアムを取得する（ランダム並び替え）
func (s *MuseumService) GetOtherUsersPublicMuseums(excludeUserID int, limit int) ([]domain.MuseumResponse, error) {
	if excludeUserID <= 0 {
		return nil, errors.New("invalid user ID")
	}
	if limit <= 0 || limit > 100 {
		limit = 10 // デフォルト値
	}

	museums, err := s.repo.GetPublicMuseumsExcludingUser(excludeUserID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get public museums: %w", err)
	}

	responses := make([]domain.MuseumResponse, len(museums))
	for i, museum := range museums {
		responses[i] = museum.ToResponse()
	}

	// ランダムに並び替え
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(responses), func(i, j int) {
		responses[i], responses[j] = responses[j], responses[i]
	})

	return responses, nil
}

// GetMuseumByID は指定IDのミュージアムを取得する
func (s *MuseumService) GetMuseumByID(id int) (*domain.MuseumResponse, error) {
	if id <= 0 {
		return nil, errors.New("invalid museum ID")
	}

	museum, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get museum: %w", err)
	}
	if museum == nil {
		return nil, errors.New("museum not found")
	}

	response := museum.ToResponse()
	return &response, nil
}

// UpdateTitle はミュージアムのタイトルを更新する
func (s *MuseumService) UpdateTitle(id int, title string) error {
	if id <= 0 {
		return errors.New("invalid museum ID")
	}
	if title == "" {
		return errors.New("title cannot be empty")
	}

	err := s.repo.UpdateTitle(id, title)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("museum not found")
		}
		return fmt.Errorf("failed to update museum title: %w", err)
	}

	return nil
}

// Create は新しいミュージアムを作成する
func (s *MuseumService) Create(req domain.MuseumCreateRequest) (*domain.MuseumResponse, error) {
	if req.UserID <= 0 {
		return nil, errors.New("invalid user ID")
	}
	if req.Name == "" {
		return nil, errors.New("museum name cannot be empty")
	}

	museum := domain.Museum{
		UserID:      req.UserID,
		Name:        req.Name,
		Description: req.Description,
		Visibility:  req.Visibility,
		ImageURL:    req.ImageURL,
	}

	createdMuseum, err := s.repo.Insert(museum)
	if err != nil {
		return nil, fmt.Errorf("failed to create museum: %w", err)
	}

	response := createdMuseum.ToResponse()
	return &response, nil
}