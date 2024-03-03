package model

type User struct {
	ID           uint   `gorm:"primary_key"`
	Name         string `gorm:"column:tag"`
	Login        string `gorm:"column:login"`
	Role         string `gorm:"column:role"`
	PswHash      string `gorm:"column:psw_hash"`
	RefreshToken string `gorm:"column:refresh_token"`
}

func (User) TableName() string {
	return "users"
}
