package api

import (
	"encoding/json"
)

type Payload struct {
	Meta json.RawMessage `json:"meta,omitempty"`
	Data json.RawMessage `json:"data,omitempty"`
}

type Response struct {
	Payload   Payload  `json:"payload"`
	Messages  []string `json:"messages"`
	ErrorCode int      `json:"errorCode"`
}

// Data to retrieve data regarding user's information
type User struct {
	Name string  `json:"name"`
}

type LoginResponse struct {
	Success bool `json:"success"`
}

type AddPostResponse struct {
	Success bool `json:"success"`
}