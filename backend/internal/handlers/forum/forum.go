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
	if err != nil {
		return nil, err
	}

	// Process rawData and transform it into the API response
	var posts []api.RetrievePostResponse
	for _, item := range rawData {
		// `item` is already a map[string]interface{}
		userCommentsRaw, _ := json.Marshal(item["user_comments"]) // Marshal to handle the raw data properly

		// Parse the raw JSON array into a Go data structure (slice of interfaces)
		var userComments []interface{}
		if err := json.Unmarshal(userCommentsRaw, &userComments); err != nil {
			// If unmarshalling fails, handle the error appropriately (e.g., set an empty slice or return an error)
			userComments = []interface{}{}
		}

		post := api.RetrievePostResponse{
			Identity_number: item["identity_number"].(int), // Assuming JSON numbers are floats
			Topic:           item["topic"].(string),
			PostType:        item["type"].(string),
			Username:        item["username"].(string),
			UserComments:    userComments, // Add user_comments here
		}
		posts = append(posts, post)
	}

	return posts, nil
}


