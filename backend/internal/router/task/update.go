package task

import (
	"errors"
	"exmaple/internal/api/token"
	_const "exmaple/internal/const"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/request"
	"exmaple/internal/response"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"log"
	"net/http"
)

func Update(c echo.Context) error {
	id := c.Param("id")

	req := new(request.TaskRequest)
	err := c.Bind(req)

	userID := token.GetUserIDFromToken(&c)

	if err != nil {
		log.Fatal(err)
	}

	database, dbClose := db.Connect()
	defer dbClose()

	var task model.Task
	err = database.Transaction(func(tx *gorm.DB) error {
		var user model.User
		tx.Where("id = ?", userID).First(&user)

		result := tx.Where("id = ?", id).First(&task)
		if result.RowsAffected == 0 {
			return errors.New("Задача не найдена")
		}

		if user.Role == _const.ADMIN {
			task.IDUser = req.IDUser
		} else if user.ID == task.IDUser {
			task.IDUser = user.ID
		} else {
			return errors.New("Не прав на обновление!")
		}

		task.Text = req.Text
		task.Complete = req.Complete
		database.Save(&task)

		tx.Where("id = ?", id).Preload("User").First(&task)

		return nil
	})

	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	res := response.TaskResponse{
		ID:       task.ID,
		Text:     task.Text,
		Complete: task.Complete,
		User: response.UserResponse{
			ID:   task.User.ID,
			Name: task.User.Name,
			Role: task.User.Role,
		},
	}

	return c.JSON(http.StatusCreated, res)
}
