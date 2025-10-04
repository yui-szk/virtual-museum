package domain

// MetObject represents artwork data from the Metropolitan Museum API
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