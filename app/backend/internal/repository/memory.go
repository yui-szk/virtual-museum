package repository

import (
    "errors"
    "sync"
    "time"

    "backend/internal/domain"
)

// ItemRepository defines storage operations for Items.
type ItemRepository interface {
    List() ([]domain.Item, error)
    Create(name string) (domain.Item, error)
}

// InMemoryItemRepository is a concurrency-safe in-memory store.
type InMemoryItemRepository struct {
    mu    sync.RWMutex
    last  int
    items []domain.Item
}

func NewInMemoryItemRepository() *InMemoryItemRepository {
    return &InMemoryItemRepository{}
}

func (r *InMemoryItemRepository) List() ([]domain.Item, error) {
    r.mu.RLock()
    defer r.mu.RUnlock()
    // Return a copy to avoid external mutation
    out := make([]domain.Item, len(r.items))
    copy(out, r.items)
    return out, nil
}

func (r *InMemoryItemRepository) Create(name string) (domain.Item, error) {
    if name == "" {
        return domain.Item{}, errors.New("name required")
    }
    r.mu.Lock()
    defer r.mu.Unlock()
    r.last++
    it := domain.Item{ID: r.last, Name: name, CreatedAt: time.Now().UTC()}
    r.items = append(r.items, it)
    return it, nil
}

// MustSeed populates initial items for local development.
func (r *InMemoryItemRepository) MustSeed(names ...string) *InMemoryItemRepository {
    for _, n := range names {
        _, _ = r.Create(n)
    }
    return r
}

