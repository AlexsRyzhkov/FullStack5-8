package main

import (
	"exmaple/internal/api/hash-psw"
	_const "exmaple/internal/const"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/router"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
	"os"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	e.Use(middleware.CORS())

	database, closeDB := db.Connect()
	db.Migration(database)
	
	var user model.User
	result := database.Where("role = ?", _const.ADMIN).First(&user)
	if result.RowsAffected == 0 {
		pwdHash, _ := hash.HashPassword("admin")

		user = model.User{
			Name:    "Admin",
			Login:   "admin",
			PswHash: pwdHash,
			Role:    _const.ADMIN,
		}

		database.Create(&user)
	}

	router.Init(e)

	router.InitSecurity(e)

	closeDB()
	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
