package forum

import (
	"fmt"
	"github.com/CVWO/sample-go-app/internal/database"

)

func AddPost(topic string, postType string, id int) (bool, error) {
    query := `INSERT INTO "Forum" ("Topic", "Type", "ID") VALUES ($1, $2, $3)`
    _, err := database.DB.Exec(query, topic, postType, id)

    fmt.Printf("Error is: %v\n", err)

    if err != nil { 
        return false, fmt.Errorf("error inserting post: %w", err)
    }

	fmt.Printf("Query success")
    return true, nil
}
