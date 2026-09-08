package errors

import "fmt"

type ApiError struct {
	HTTPCode int
	Message  string
	Err      error
}

func (e *ApiError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func NewInternal(msg string, err error) *ApiError {
	return &ApiError{HTTPCode: 500, Message: msg, Err: err}
}

func NewBadRequest(msg string, err error) *ApiError {
	return &ApiError{HTTPCode: 400, Message: msg, Err: err}
}
func NewNotFount(msg string, err error) *ApiError {
	return &ApiError{HTTPCode: 404, Message: msg, Err: err}
}
