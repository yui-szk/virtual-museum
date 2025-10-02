package config

import (
    "os"
    "strconv"
    "strings"
)

// Config holds application configuration loaded from env.
type Config struct {
    Port           int
    AllowedOrigins []string
    Env            string // development, production, test
}

func getEnv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
    // Prefer PORT (12-factor), fallback to BACKEND_PORT
    portStr := getEnv("PORT", getEnv("BACKEND_PORT", "8080"))
    port, err := strconv.Atoi(portStr)
    if err != nil || port <= 0 {
        port = 8080
    }

    // Allow comma-separated origins; default to common local dev URL
    cors := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
    origins := []string{}
    for _, o := range strings.Split(cors, ",") {
        o = strings.TrimSpace(o)
        if o != "" {
            origins = append(origins, o)
        }
    }

    env := getEnv("APP_ENV", getEnv("ENV", "development"))

    return Config{
        Port:           port,
        AllowedOrigins: origins,
        Env:            env,
    }
}

