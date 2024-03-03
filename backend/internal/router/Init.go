package router

import (
	"exmaple/internal/api/token"
	"exmaple/internal/router/auth"
	"exmaple/internal/router/task"
	"exmaple/internal/router/user"
	jwt2 "github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"os"
)

func Init(e *echo.Echo) {
	authentication := e.Group("/auth")
	authentication.POST("/login", auth.Login)
	authentication.POST("/register", auth.Register)

}
func InitSecurity(e *echo.Echo) {

	secure := e.Group("")

	secure.Use(echojwt.WithConfig(echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt2.Claims {
			return new(token.JwtCustomClaims)
		},
		SigningKey: []byte(os.Getenv("SECRET_KEY")),
		ContextKey: "token",
	}))

	secure.POST("/auth/refresh", auth.Refresh)
	secure.POST("/tasks", task.Create)
	secure.GET("/tasks", task.GetAll)
	secure.DELETE("/tasks/:id", task.Delete)
	secure.PUT("/tasks/:id", task.Update)

	secure.GET("/users", user.GetAll)
	secure.GET("/me", user.GetMe)

}
