package users

import (
	"encoding/json"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/api"
	users "github.com/CVWO/sample-go-app/internal/dataaccess/users"
)

// AddUser registers a new user
func RegisterUserHelper(w http.ResponseWriter, r *http.Request) (*api.LoginResponse, error) {
	var userRequest struct {
		Name string `json:"name"`
	}
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return nil, err
	}

	exists, err := users.RegisterUser(userRequest.Name)
	if err != nil {
		http.Error(w, "Failed to check user", http.StatusInternalServerError)
		return nil, err
	}

	response := &api.LoginResponse{
		Success: exists,
	}
	return response, nil
}

// CheckUser checks if a user exists in the database
func AuthenticateUserHelper(w http.ResponseWriter, r *http.Request) (*api.LoginResponse, error) {
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
