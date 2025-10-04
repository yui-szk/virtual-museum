package service

import (
    "backend/internal/domain"
    "backend/internal/repository"
)

// MuseumService contains business logic for Museums.
type MuseumService struct {
    repo repository.MuseumRepository
}

func NewMuseumService(repo repository.MuseumRepository) *MuseumService {
    return &MuseumService{repo: repo}
}

// GetOtherUsersPublicMuseums returns public museums excluding the specified user's museums
func (s *MuseumService) GetOtherUsersPublicMuseums(currentUserID int) ([]domain.MuseumResponse, error) {
    museums, err := s.repo.GetPublicMuseumsExcludingUser(currentUserID)
    if err != nil {
        return nil, err
    }

    responses := make([]domain.MuseumResponse, len(museums))
    for i, museum := range museums {
        responses[i] = museum.ToResponse()
    }

    return responses, nil
}