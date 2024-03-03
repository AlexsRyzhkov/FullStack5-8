package auth

import (
	"exmaple/internal/api/hash-psw"
	"exmaple/internal/api/token"
	_const "exmaple/internal/const"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/request"
	"exmaple/internal/response"
	"fmt"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

func Register(c echo.Context) error {

	req := new(request.RegisterRequest)
	err := c.Bind(req)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(req)

	database, dbClose := db.Connect()
	defer dbClose()

	var user model.User
	result := database.Where("login = ?", req.Login).First(&user)
	if result.RowsAffected > 0 {
		return c.String(http.StatusBadRequest, "Такой пользователь существует")
	}

	pwdHash, err := hash.HashPassword(req.Password)
	if err != nil {
		log.Fatal(err)
	}

	user = model.User{
		Name:    req.Name,
		Login:   req.Login,
		PswHash: pwdHash,
		Role:    _const.USER,
	}

	database.Create(&user)

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
