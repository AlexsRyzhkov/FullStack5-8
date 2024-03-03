package response

type UserResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type TaskResponse struct {
	ID       uint         `json:"id"`
	Text     string       `json:"text"`
	Complete bool         `json:"complete"`
	User     UserResponse `json:"user"`
}
