package service

import (
    "encoding/json"
    "fmt"
    "net/http"

    "backend/internal/domain"
)

type MetService struct {
    client *http.Client
}

func NewMetService() *MetService {
    return &MetService{client: &http.Client{}}
}

// GetObjectByID fetches a single artwork object from the MET API
func (s *MetService) GetObjectByID(id int) (*domain.MetObject, error) {
    url := fmt.Sprintf("https://collectionapi.metmuseum.org/public/collection/v1/objects/%d", id)
    resp, err := s.client.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("MET API returned %d", resp.StatusCode)
    }

    var obj domain.MetObject
    if err := json.NewDecoder(resp.Body).Decode(&obj); err != nil {
        return nil, err
    }

    return &obj, nil
}