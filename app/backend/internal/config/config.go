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

    // MySQL
    DBEnabled bool
    DBHost    string
    DBPort    int
    DBUser    string
    DBPass    string
    DBName    string
    DBMigrate bool // create tables if not exists
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

    // Database settings (defaults suitable for docker-compose)
    dbEnabled := strings.ToLower(getEnv("DB_ENABLED", "true")) == "true"
    dbHost := getEnv("DB_HOST", "app-mysql")
    dbPortStr := getEnv("DB_PORT", "3306")
    dbPort, _ := strconv.Atoi(dbPortStr)
    if dbPort <= 0 {
        dbPort = 3306
    }
    dbUser := getEnv("DB_USER", "appuser")
    dbPass := getEnv("DB_PASSWORD", getEnv("DB_PASS", "apppass"))
    dbName := getEnv("DB_NAME", "appdb")
    dbMigrate := strings.ToLower(getEnv("DB_MIGRATE", "true")) == "true"

    return Config{
        Port:           port,
        AllowedOrigins: origins,
        Env:            env,
        DBEnabled:      dbEnabled,
        DBHost:         dbHost,
        DBPort:         dbPort,
        DBUser:         dbUser,
        DBPass:         dbPass,
        DBName:         dbName,
        DBMigrate:      dbMigrate,
    }
}

// MySQLDSN builds a DSN using environment configuration.
func (c Config) MySQLDSN() string {
    hostport := c.DBHost
    if c.DBPort > 0 {
        hostport = c.DBHost + ":" + strconv.Itoa(c.DBPort)
    }
    // parseTime enables time.Time for DATETIME/TIMESTAMP
    return c.DBUser + ":" + c.DBPass + "@tcp(" + hostport + ")/" + c.DBName + "?parseTime=true&charset=utf8mb4&loc=Local"
}
