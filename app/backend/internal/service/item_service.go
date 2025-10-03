package service

import (
    "errors"
    "strings"

    "backend/internal/domain"
    "backend/internal/repository"
)

// ItemService contains business logic for Items and validates inputs.
type ItemService struct {
    repo repository.ItemRepository
}

func NewItemService(repo repository.ItemRepository) *ItemService {
    return &ItemService{repo: repo}
}

func (s *ItemService) List() ([]domain.Item, error) {
    return s.repo.List()
}

func (s *ItemService) Create(name string) (domain.Item, error) {
    name = strings.TrimSpace(name)
    if name == "" {
        return domain.Item{}, errors.New("name is required")
    }
    if len(name) > 100 {
        return domain.Item{}, errors.New("name is too long (max 100)")
    }
    return s.repo.Create(name)
}

