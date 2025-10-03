package logger

import (
    "log/slog"
    "os"
)

// New returns a structured JSON slog.Logger configured for the given environment.
func New(env string) *slog.Logger {
    // In development, we still prefer JSON for consistency with production logs.
    handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{})
    return slog.New(handler).With("env", env)
}

