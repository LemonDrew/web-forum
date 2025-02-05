package users

import (
	"fmt"
	"log"
	"github.com/CVWO/sample-go-app/internal/database"

)

func RegisterUser(name string) (bool, error) {
	query := `SELECT COUNT(*) FROM "users" WHERE name = $1`

	var count int
	err := database.DB.QueryRow(query, name).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check if user exists: %w", err)
	}

	if count > 0 { // User already exists in the database
		return false, nil
	}
	insertQuery := `INSERT INTO "users" (name) VALUES ($1)`
	_, err = database.DB.Exec(insertQuery, name)
	if err != nil {
		return false, fmt.Errorf("failed to add user: %w", err)
	}

	log.Printf("User '%s' added successfully!", name)
	return true, nil 
}

func AuthenticateUser(name string) (bool, error) {
	query := `SELECT COUNT(*) FROM "users" WHERE name = $1`
	
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

