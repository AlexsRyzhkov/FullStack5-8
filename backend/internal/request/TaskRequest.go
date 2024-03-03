package request

type TaskRequest struct {
	Text     string `json:"text"`
	Complete bool   `json:"complete"`
	IDUser   uint   `json:"id_user"`
}
