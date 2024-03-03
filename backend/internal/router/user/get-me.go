package user

import (
	"exmaple/internal/api/token"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/response"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetMe(c echo.Context) error {
	userID := token.GetUserIDFromToken(&c)

	database, dbClose := db.Connect()
	defer dbClose()

	var user model.User

	database.Where("id = ?", userID).First(&user)

	res := response.UserResponse{
		ID:   user.ID,
		Name: user.Name,
		Role: user.Role,
	}

	return c.JSON(http.StatusOK, res)

}
