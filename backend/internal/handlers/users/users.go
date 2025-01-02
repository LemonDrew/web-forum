package users

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/api"
	users "github.com/CVWO/sample-go-app/internal/dataaccess"
)

// AddUser registers a new user
func AddUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	var userRequest struct {
		Name string `json:"name"`
	}

	err := json.NewDecoder(r.Body).Decode(&userRequest)
	err = users.RegisterUser(userRequest.Name)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return nil, err
	}

	response := &api.Response{
		Payload: api.Payload{
			Data: []byte(fmt.Sprintf(`{ success : true}`)),
		},
		Messages: []string{"User registered successfully"},
	}

	w.Header().Set("Content-Type", "application/json")
	return response, nil
}

// CheckUser checks if a user exists in the database
func CheckUser(w http.ResponseWriter, r *http.Request) (*api.LoginResponse, error) {
	var userRequest struct {
		Name string `json:"name"`
	}
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return nil, err
	}

	exists, err := users.AuthenticateUser(userRequest.Name)
	if err != nil {
		http.Error(w, "Failed to check user", http.StatusInternalServerError)
		return nil, err
	}

	response := &api.LoginResponse{
		Success: exists,
	}
	return response, nil
}
