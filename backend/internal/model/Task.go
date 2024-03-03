package model

type Task struct {
	ID       uint   `gorm:"primary_key"`
	Text     string `gorm:"column:text"`
	Complete bool   `gorm:"column:login"`

	IDUser uint `gorm:"column:id_user"`

	User User `gorm:"foreignKey:IDUser"`
}

func (Task) TableName() string {
	return "tasks"
}
