package users

import (
	"log"
	"github.com/CVWO/sample-go-app/internal/database"
	"github.com/CVWO/sample-go-app/internal/models"
)

func List(db *database.Database) ([]models.User, error) {
	users := []models.User{
		{
			ID:   1,
			Name: "CVWO",
		},
	}
	return users, nil
}

func RegisterUser(name string) error {
	query := `INSERT INTO "Users" (name) VALUES ($1)`
	_, err := database.DB.Exec(query, name)
	if err != nil {
		log.Printf("Failed to insert user: %v", err)
		return err
	}

	log.Printf("User '%s' added successfully!", name)
	return nil
}
