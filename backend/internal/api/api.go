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

type RetrievePostResponse struct {
    Identity_number int         `json:"identity_number"`
    Topic           string      `json:"topic"`
    PostType        string      `json:"type"`
    Username        string      `json:"username"`
    UserComments    []interface{} `json:"user_comments"` // Use []interface{} for JSON array or use a more specific type
}