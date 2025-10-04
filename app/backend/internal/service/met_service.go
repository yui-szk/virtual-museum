package service

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type MetService struct {
    client *http.Client
}

func NewMetService() *MetService {
    return &MetService{client: &http.Client{}}
}

type MetObject struct {
    ObjectID          int    `json:"objectID"`           // 一意の作品ID　-> image_url
    Title             string `json:"title"`              // 作品タイトル
    ArtistDisplayName string `json:"artistDisplayName"`  // 作者名
    Department        string `json:"department"`         // 部門
    ObjectDate        string `json:"objectDate"`         // 制作年代
    Medium            string `json:"medium"`             // 材質・技法
    IsPublicDomain    bool   `json:"isPublicDomain"`     // パブリックドメインか
    PrimaryImage      string `json:"primaryImage"`       // 高解像度画像URL
    PrimaryImageSmall string `json:"primaryImageSmall"`  // サムネイル画像URL
    ObjectURL         string `json:"objectURL"`          // MET公式URL
    Culture           string `json:"culture"`            // 文化圏・民族的背景（例: "Japanese", "Greek", "Islamic"）
    Country           string `json:"country"`            // 制作国・出土地（例: "France", "China", "Egypt"）
    Tags              []any  `json:"tags"`               // 作品に関連する主題・モチーフ（例: ["Landscape", "Religion"]）
}

// GetObjectByID fetches a single artwork object from the MET API
func (s *MetService) GetObjectByID(id int) (*MetObject, error) {
    url := fmt.Sprintf("https://collectionapi.metmuseum.org/public/collection/v1/objects/%d", id)
    resp, err := s.client.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("MET API returned %d", resp.StatusCode)
    }

    var obj MetObject
    if err := json.NewDecoder(resp.Body).Decode(&obj); err != nil {
        return nil, err
    }

    return &obj, nil
}