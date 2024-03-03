package auth

import (
	"exmaple/internal/api/hash-psw"
	"exmaple/internal/api/token"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/request"
	"exmaple/internal/response"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

func Login(c echo.Context) error {
	req := new(request.LoginRequest)
	err := c.Bind(req)
	if err != nil {
		log.Fatal(err)
	}

	database, dbClose := db.Connect()
	defer dbClose()

	var user model.User
	result := database.Where("login = ?", req.Login).First(&user)
	if result.RowsAffected == 0 {
		return c.String(http.StatusBadRequest, "Не верный логин или пароль")
	}

	if !hash.CheckPasswordHash(req.Password, user.PswHash) {
		return c.String(http.StatusBadRequest, "Не верный логин или пароль")
	}

	accessToken, err := token.GenerateAccessToken(user.ID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Ошибка Сервера")
	}

	refreshToken, err := token.GenerateRefreshToken(user.ID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Ошибка Сервера")
	}

	user.RefreshToken = refreshToken
	database.Save(&user)

	return c.JSON(http.StatusOK, &response.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		UserID:       user.ID,
	})
}
