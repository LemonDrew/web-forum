package database

import (
	"database/sql"
	"fmt"
  
	_ "github.com/lib/pq"
)

var DB *sql.DB

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "4siicuya"
	dbname   = "postgres"
)

type Database struct {
}

func GetDB() (*Database, error) {
	return &Database{}, nil
}

func ConnectDataBase() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(fmt.Errorf("failed to open database: %v", err))
	}

	err = DB.Ping()
	if err != nil {
		panic(fmt.Errorf("failed to connect to the database: %v", err))
	}

	fmt.Println("Connected to the database!")
}