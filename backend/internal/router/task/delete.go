package task

import (
	"errors"
	"exmaple/internal/api/token"
	_const "exmaple/internal/const"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
)

func Delete(c echo.Context) error {
	id := c.Param("id")

	userID := token.GetUserIDFromToken(&c)

	database, dbClose := db.Connect()
	defer dbClose()

	err := database.Transaction(func(tx *gorm.DB) error {
		var user model.User
		tx.Where("id = ?", userID).First(&user)

		var task model.Task
		result := tx.Where("id = ?", id).First(&task)

		if result.RowsAffected == 0 {
			return errors.New("Ошибка удаления")
		}

		if user.Role == _const.ADMIN || user.ID == task.IDUser {
			if err := tx.Delete(&task).Error; err != nil {
				return err
			}
		} else {
			return errors.New("Не прав на удаление!")
		}

		return nil
	})

	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.String(http.StatusOK, "Успешно")
}
