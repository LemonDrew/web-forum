package routes

import (
	"encoding/json"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/handlers/users"
	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		// Change to POST since we are adding a user
		r.Post("/users", func(w http.ResponseWriter, req *http.Request) {
			// Call AddUser to register a new user
			response, err := users.AddUser(w, req)
			if err != nil {
				// Handle the error properly if AddUser fails
				http.Error(w, "Failed to add user", http.StatusInternalServerError)
				return
			}

			// Send the response in JSON format
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		})
	}
}
