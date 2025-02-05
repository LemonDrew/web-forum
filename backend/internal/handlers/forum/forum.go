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
		Username string `json:"username"`
	}

	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input: unable to decode JSON", http.StatusBadRequest)
		return nil, err
	}

	success, err := forum.AddPost(userRequest.Topic, userRequest.PostType, userRequest.Username)
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


func RetrievePostHelper(w http.ResponseWriter, r *http.Request) ([]api.RetrievePostResponse, error) {
    // Call the RetrievePost function to get raw data
    rawData, err := forum.RetrievePost()

    // Process rawData and transform it into the API response
    var posts []api.RetrievePostResponse
    for _, item := range rawData {
        // `item` is already a map[string]interface{}
        post := api.RetrievePostResponse{
            Identity_number: item["identity_number"].(int), // Assuming JSON numbers are floats
            Topic:           item["topic"].(string),
            PostType:        item["type"].(string),
            Username:        item["username"].(string),
        }
        posts = append(posts, post)
    }

    return posts, err
}

