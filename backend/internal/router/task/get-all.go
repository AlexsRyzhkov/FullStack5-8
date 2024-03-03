package task

import (
	"exmaple/internal/api/token"
	_const "exmaple/internal/const"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/response"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetAll(c echo.Context) error {
	userID := token.GetUserIDFromToken(&c)

	database, dbClose := db.Connect()
	defer dbClose()

	var user model.User
	database.Where("id = ?", userID).First(&user)

	var tasks []model.Task
	if user.Role == _const.ADMIN {
		database.Preload("User").Order("id asc").Find(&tasks)
	} else {
		database.Where("id_user = ?", userID).Preload("User").Order("id asc").Find(&tasks)
	}

	var res []response.TaskResponse
	for _, task := range tasks {
		res = append(res, response.TaskResponse{
			ID:       task.ID,
			Text:     task.Text,
			Complete: task.Complete,
			User: response.UserResponse{
				ID:   task.User.ID,
				Name: task.User.Name,
				Role: task.User.Role,
			},
		})
	}

	return c.JSON(http.StatusOK, res)
}
