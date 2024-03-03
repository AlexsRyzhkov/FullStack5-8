package task

import (
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

func Create(c echo.Context) error {
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

		if user.Role == _const.ADMIN {
			userID = req.IDUser
		}

		task = model.Task{
			Text:     req.Text,
			Complete: false,
			IDUser:   userID,
		}

		if err := tx.Create(&task).Error; err != nil {
			return err
		}
		tx.Where("id = ?", task.ID).Preload("User").First(&task)

		return nil
	})

	if err != nil {
		return c.String(http.StatusInternalServerError, "Не удалось создать задачу")
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
