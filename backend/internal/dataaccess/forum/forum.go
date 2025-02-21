package forum

import (
	"fmt"
	"github.com/CVWO/sample-go-app/internal/database"
	"encoding/json"
	"database/sql"
)

func AddPost(topic string, postType string, username string) (bool, error) {
    query := `INSERT INTO "forum" ("topic", "type", "username") VALUES ($1, $2, $3)`
    _, err := database.DB.Exec(query, topic, postType, username)

    fmt.Printf("Error is: %v\n", err)

    if err != nil { 
        return false, fmt.Errorf("error inserting post: %w", err)
    }

	fmt.Printf("Query success")
    return true, nil
}

func RetrievePost() ([]map[string]interface{}, error) {
	query := `SELECT identity_number, topic, type, username, user_comments FROM "forum"`
	rows, err := database.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error retrieving post: %w", err)
	}
	defer rows.Close()

	var rawData []map[string]interface{}
	for rows.Next() {
		var identityNumber int
		var topic, postType, username string
		var userComments json.RawMessage // To hold the JSONB data

		err := rows.Scan(&identityNumber, &topic, &postType, &username, &userComments)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		// Convert the JSONB data to a map or a slice if necessary
		var userCommentsData interface{}
		if userComments != nil {
			if err := json.Unmarshal(userComments, &userCommentsData); err != nil {
				return nil, fmt.Errorf("error unmarshaling user_comments: %w", err)
			}
		}

		rawData = append(rawData, map[string]interface{}{
			"identity_number": identityNumber,
			"topic":           topic,
			"type":            postType,
			"username":        username,
			"user_comments":   userCommentsData, // Store the unmarshalled user_comments
		})
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}
	return rawData, nil
}

// AddComment appends a new comment to the user_comments JSONB column
func AddComment(identityNumber int, comment string, username string) (bool, error) {
	// Fetch the existing user_comments from the database
	var existingComments [][]string
	query := `SELECT user_comments FROM forum WHERE identity_number = $1`
	row := database.DB.QueryRow(query, identityNumber)

	var userCommentsJSON []byte
	err := row.Scan(&userCommentsJSON)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, fmt.Errorf("no post found with identity_number %d", identityNumber)
		}
		return false, fmt.Errorf("error retrieving user_comments: %w", err)
	}

	// Unmarshal existing comments if there are any
	if len(userCommentsJSON) > 0 {
		err = json.Unmarshal(userCommentsJSON, &existingComments)
		if err != nil {
			return false, fmt.Errorf("error unmarshaling user_comments: %w", err)
		}
	}

	// Append the new comment as an array [username, comment]
	newComment := []string{username, comment}
	existingComments = append(existingComments, newComment)

	// Marshal back to JSON format
	updatedCommentsJSON, err := json.Marshal(existingComments)
	if err != nil {
		return false, fmt.Errorf("error marshaling updated user_comments: %w", err)
	}

	// Update the database with the new JSON array
	updateQuery := `UPDATE forum SET user_comments = $1 WHERE identity_number = $2`
	_, err = database.DB.Exec(updateQuery, updatedCommentsJSON, identityNumber)
	if err != nil {
		return false, fmt.Errorf("error updating user_comments: %w", err)
	}

	fmt.Println("Comment successfully added.")
	return true, nil
}