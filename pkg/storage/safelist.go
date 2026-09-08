package storage

import (
	"container/list"
	"sync"
)

type SafeList struct {
	list *list.List
	mu   sync.Mutex
}

func (s *SafeList) Init() *SafeList {
	s.mu.Lock()
	defer s.mu.Unlock()
	return &SafeList{list: list.New().Init()}
}
func (s *SafeList) Remove(e *list.Element) any {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.Remove(e)
}
func (s *SafeList) PushFront(v any) *list.Element {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.PushFront(v)
}
func (s *SafeList) MoveToFront(e *list.Element) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.list.MoveToFront(e)
}
func (s *SafeList) Back() *list.Element {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.list.Back()
}
