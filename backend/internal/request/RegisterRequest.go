package request

type RegisterRequest struct {
	Name     string `json:"name" validate:"required"`
	Login    string `json:"login" validate:"required"`
	Password string `json:"password" validate:"required"`
}
