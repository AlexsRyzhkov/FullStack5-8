package auth

import (
	"exmaple/internal/api/token"
	"exmaple/internal/db"
	"exmaple/internal/model"
	"exmaple/internal/response"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"net/http"
)

func Refresh(c echo.Context) error {
	userID := token.GetUserIDFromToken(&c)

	user := &model.User{}

	database, dbClose := db.Connect()
	defer dbClose()

	result := database.First(&user, userID)
	if result.RowsAffected == 0 {
		return c.String(http.StatusUnauthorized, "Not authorized")
	}

	getToken := c.Get("token").(*jwt.Token).Raw

	if getToken != user.RefreshToken {
		return c.String(http.StatusUnauthorized, "missing or malformed jwt")
	}

	accessToken, err := token.GenerateAccessToken(userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Ошибка Сервера")
	}

	refreshToken, err := token.GenerateRefreshToken(userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Ошибка Сервера")
	}

	user.RefreshToken = refreshToken

	database.Save(&user)

	return c.JSON(http.StatusOK, &response.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		UserID:       userID,
	})
}
