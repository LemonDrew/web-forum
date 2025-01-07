package forum

import (
	"encoding/json"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/api"
	"github.com/CVWO/sample-go-app/internal/dataaccess/forum"
)

func AddPostHelper(w http.ResponseWriter, r *http.Request) (*api.AddPostResponse, error) {
	var userRequest struct {
		Topic    string `json:"topic"`
		PostType string `json:"type"`
		ID       int    `json:"id"`
	}

	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input: unable to decode JSON", http.StatusBadRequest)
		return nil, err
	}

	success, err := forum.AddPost(userRequest.Topic, userRequest.PostType, userRequest.ID)
	if err != nil {
		http.Error(w, "Failed to add post to database", http.StatusInternalServerError)
		return nil, err
	}

	// Create response
	response := &api.AddPostResponse{
		Success: success,
	}
	return response, nil
}