package user

import (
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/response"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetAll(c echo.Context) error {
	database, dbClose := db.Connect()
	defer dbClose()

	var users []model.User

	database.Find(&users)

	var res []response.UserResponse
	for _, user := range users {
		res = append(res, response.UserResponse{
			ID:   user.ID,
			Name: user.Name,
			Role: user.Role,
		})
	}

	return c.JSON(http.StatusOK, res)

}
