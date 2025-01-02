package users

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/api"
	users "github.com/CVWO/sample-go-app/internal/dataaccess"
)

const (
	ListUsers = "users.HandleList"

	SuccessfulListUsersMessage = "Successfully listed users"
	ErrRetrieveDatabase        = "Failed to retrieve database in %s"
	ErrRetrieveUsers           = "Failed to retrieve users in %s"
	ErrEncodeView              = "Failed to retrieve users in %s"
)

// AddUser registers a new user
func AddUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	var userRequest struct {
		Name string `json:"name"`
	}

	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return nil, err
	}

	err = users.RegisterUser(userRequest.Name)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return nil, err
	}

	response := &api.Response{
		Payload: api.Payload{
			Data: []byte(fmt.Sprintf("User '%s' added successfully", userRequest.Name)),
		},
		Messages: []string{"User registered successfully"},
	}

	w.Header().Set("Content-Type", "application/json")
	return response, nil
}

// CheckUser checks if a user exists in the database
func CheckUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
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

	if !exists {
		http.Error(w, "User does not exist in the database", http.StatusNotFound)
		return nil, fmt.Errorf("user does not exist: %s", userRequest.Name)
	}

	response := &api.Response{
		Payload: api.Payload{
			Data: []byte(fmt.Sprintf("User '%s' found in the database", userRequest.Name)),
		},
		Messages: []string{"User found in the database"},
	}

	w.Header().Set("Content-Type", "application/json")
	return response, nil
}
