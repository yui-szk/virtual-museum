package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"backend/internal/domain"
)

// ArtworkSearchService はMET APIを使用した作品検索サービス
type ArtworkSearchService struct {
	client  *http.Client
	baseURL string
}

// NewArtworkSearchService は新しいArtworkSearchServiceを作成する
func NewArtworkSearchService() *ArtworkSearchService {
	return &ArtworkSearchService{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
	}
}

// MetSearchResponse はMET APIの検索レスポンス
type MetSearchResponse struct {
	Total     int   `json:"total"`
	ObjectIDs []int `json:"objectIDs"`
}

// SearchArtworks はMET APIを使用して作品を検索する
func (s *ArtworkSearchService) SearchArtworks(query domain.ArtworkSearchQuery, limit int) (*MetSearchResponse, error) {
	if limit <= 0 || limit > 100 {
		limit = 20 // デフォルト値
	}

	// クエリパラメータを構築
	params := url.Values{}
	params.Set("q", "*") // 基本的な検索クエリ

	if query.IsHighlight != nil {
		params.Set("isHighlight", strconv.FormatBool(*query.IsHighlight))
	}
	if query.ObjectDate != "" {
		params.Set("dateBegin", query.ObjectDate)
		params.Set("dateEnd", query.ObjectDate)
	}
	if query.City != "" {
		params.Set("geoLocation", query.City)
	}
	if query.Medium != "" {
		params.Set("medium", query.Medium)
	}

	// APIリクエストを実行
	searchURL := fmt.Sprintf("%s/search?%s", s.baseURL, params.Encode())
	
	resp, err := s.client.Get(searchURL)
	if err != nil {
		return nil, fmt.Errorf("failed to call MET API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("MET API returned status %d", resp.StatusCode)
	}

	var searchResp MetSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
		return nil, fmt.Errorf("failed to decode MET API response: %w", err)
	}

	// 結果を制限
	if len(searchResp.ObjectIDs) > limit {
		searchResp.ObjectIDs = searchResp.ObjectIDs[:limit]
	}

	return &searchResp, nil
}