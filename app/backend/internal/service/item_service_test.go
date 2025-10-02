package service

import (
    "testing"

    "backend/internal/repository"
)

func TestItemService_Create_Validation(t *testing.T) {
    svc := NewItemService(repository.NewInMemoryItemRepository())

    if _, err := svc.Create(""); err == nil {
        t.Fatalf("expected error for empty name")
    }
    if _, err := svc.Create(" "); err == nil {
        t.Fatalf("expected error for whitespace name")
    }
    // Long name
    long := make([]byte, 101)
    for i := range long {
        long[i] = 'a'
    }
    if _, err := svc.Create(string(long)); err == nil {
        t.Fatalf("expected error for long name")
    }

    if _, err := svc.Create("ok"); err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
}

