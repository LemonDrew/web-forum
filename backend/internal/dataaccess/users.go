package users

import (
	"fmt"
	"log"
	"github.com/CVWO/sample-go-app/internal/database"

)

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

func AuthenticateUser(name string) (bool, error) {
	query := `SELECT COUNT(*) FROM "Users" WHERE name = $1`
	
	var count int
	err := database.DB.QueryRow(query, name).Scan(&count)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, fmt.Errorf("failed to check user existence: %w", err)
	}

	if count > 0 {
		return true, nil
	}
	log.Printf("User '%s' is not found!", name)
	return false, nil
}

