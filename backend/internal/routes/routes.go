package routes

import (
	"encoding/json"
	"net/http"

	"github.com/CVWO/sample-go-app/internal/handlers/users"
	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		r.Post("/register", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.AddUser(w, req)
			if err != nil {
				http.Error(w, "Failed to add user", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		})

		r.Post("/authenticate", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.CheckUser(w, req)
			if err != nil {
				http.Error(w, "Failed to check user", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		})
	}
}

