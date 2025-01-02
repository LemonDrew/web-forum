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

func AddUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	var userRequest struct {
		Name string `json:"name"`
	}
	err := json.NewDecoder(r.Body).Decode(&userRequest)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return nil, err
	}
	//Register
	err = users.RegisterUser(userRequest.Name)
	if err != nil {
		// If there's an error during registration, return it
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
