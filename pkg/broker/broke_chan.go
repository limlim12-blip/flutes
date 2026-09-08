package broker

import (
	"context"
	"errors"
	"fmt"
	. "lim/internal/models"
	. "lim/pkg/logger"
	"reflect"
	"sync"
	"time"
	"uuid"
)

// queue
type route string

// type Broker interface {
// 	Publish(ctx context.Context, router string, msg []byte) error
// 	Consume(ctx context.Context, router string, handler func(context.Context, any) error) error
// 	NewQueue(cap int, router string)
// 	Close() error
// }

type BrokerChan struct {
	channels map[string]any
	mu       sync.RWMutex
}

func NewBrokerChan() *BrokerChan {
	return &BrokerChan{
		channels: make(map[string]any),
	}
}

type Msg[T any] struct {
	payload   T
	MessageId uuid.UUID
	Timestamp time.Time // application use - message timestamp
	Type      string    // application use - message type name
	UserId    string    // application use - creating user - should be authenticated user
	AppId     string    // application use - creating application id

}

// optional
func (b *BrokerChan) GetChan[T any](ctx context.Context, router Route[T]) (chan Msg[T], error) {
	Sugar.Debugw("getting channel", "route", router.Name)
	b.mu.RLock()
	chAny, ok := b.channels[router.Name]
	b.mu.RUnlock()
	if !ok {
		Sugar.Debugw("queue not yet declared", "route", router.Name)
		return nil, fmt.Errorf("queue not yet declare %s", router)
	}
	ch, ok := chAny.(chan Msg[T])
	if !ok {
		Sugar.Debugw("wrong queue type", "route", router.Name)
		return nil, fmt.Errorf("wrong queue type %s", router)
	}
	if ctx.Err() != nil {
		return nil, ctx.Err()
	}
	return ch, nil
}

func (b *BrokerChan) Publish[T any](ctx context.Context, router Route[T], msg T) error {
	Sugar.Debugw("publishing message", "route", router.Name, "data", fmt.Sprintf("%+v", msg))
	b.mu.Lock()
	a, ok := b.channels[router.Name]
	b.mu.Unlock()
	if !ok {
		Sugar.Debugw("publish failed: queue not declared", "route", router.Name)
		return fmt.Errorf("queue not yet declared %s", router)
	}
	ch, ok := a.(chan Msg[T])
	if !ok {
		Sugar.Debugw("publish failed: wrong queue type", "route", router.Name)
		return fmt.Errorf("wrong queue type %s", router)
	}

	select {
	case <-ctx.Done():
		return ctx.Err()
	case ch <- Msg[T]{payload: msg, MessageId: uuid.New()}:
		Sugar.Debugw("message published successfully", "route", router.Name)
		return nil
	}
}

func (b *BrokerChan) NewQueue[T any](cap int, router Route[T]) error {
	b.mu.Lock()
	_, ok := b.channels[router.Name]
	b.mu.Unlock()
	if ok {
		return fmt.Errorf("quere already declared %s", router.Name)
	}

	Sugar.Debugw("creating new queue", "route", router.Name, "capacity", cap)
	b.mu.Lock()
	defer b.mu.Unlock()
	if cap > 0 {
		b.channels[router.Name] = make(chan Msg[T], cap)
	} else {
		b.channels[router.Name] = make(chan Msg[T])
	}
	return nil
}

func (b *BrokerChan) Close() error {
	Sugar.Debugw("closing all channels", "total_channels", len(b.channels))
	b.mu.Lock()
	for k, a := range b.channels {
		val := reflect.ValueOf(a)
		if val.Kind() == reflect.Chan {
			val.Close()
		}
		delete(b.channels, k)
	}
	b.mu.Unlock()
	return nil
}

func (b *BrokerChan) Consume[T any](ctx context.Context, router Route[T], handler func(context.Context, T) error) error {
	Sugar.Debugw("starting consumer", "route", router.Name)
	b.mu.RLock()
	a, ok := b.channels[router.Name]
	b.mu.RUnlock()
	if !ok {
		Sugar.Debugw("consume failed: queue not found", "route", router.Name)
		return fmt.Errorf("queue not found: %s", router)
	}
	ch, ok := a.(chan Msg[T])
	if !ok {
		Sugar.Debugw("consume failed: wrong queue type", "route", router.Name)
		return fmt.Errorf("wrong queue type %s", router)
	}
	for {
		select {
		case <-ctx.Done():
			Sugar.Debugw("consumer context cancelled", "route", router.Name)
			return ctx.Err()
		case msg, ok := <-ch:
			if !ok {
				Sugar.Debugw("consumer channel not ok", "route", router.Name)
				return nil
			}
			Sugar.Debugw("consumer consumed", "route", router.Name, "data", fmt.Sprintf("%+v", msg))
			if err := handler(ctx, msg.payload); err != nil && !errors.Is(err, context.Canceled) {
				Sugar.Debugw("handler returned error", "route", router.Name, "error", err)
				return err
			}
		}
	}
}

// type BrokerChan[T any] struct {
// 	broker Broker
// }
//
// func (b *BrokerChan[T]) NewQueue(cap int, router string) {
// 	b.broker.NewQueue(cap, router)
// }
// func (b *BrokerChan[T]) Publish(ctx context.Context, router string, msg T) error {
// 	data, err := json.Marshal(msg)
// 	if err != nil {
// 		return fmt.Errorf("msg type: %s err: %v", router, err)
// 	}
// 	return b.broker.Publish(ctx, router, data)
// }
// func (b *BrokerChan[T]) Consume(ctx context.Context, router string, handler func(context.Context, T) error) error {
// 	return b.broker.Consume(ctx, router, func(ctx context.Context, bytes []byte) error {
// 		var msg T
// 		if err := json.Unmarshal(bytes, &msg); err != nil {
// 			return err
// 		}
// 		return handler(ctx, msg)
// 	})
// }
// func (b *BrokerChan[T]) Close() error {
// 	return b.broker.Close()
// }
// func NewBrokerChan[T any](broker Broker) BrokerChan[T] {
// 	return BrokerChan[T]{broker}
// }
// func NewChanelBroker() *ChannelBroker {
// 	return &ChannelBroker{
// 		channels: make(map[string]chan []byte),
// 	}
// }
