package broker

import (
	"context"
	"errors"
	"fmt"
	. "lim/internal/models"
	. "lim/pkg/logger"
)

type Client interface {
	Close() error
}
type Broker struct {
	broker Client
}

func NewBroker(c Client) *Broker {
	return &Broker{
		broker: c,
	}

}

// rabbit Broker no have this method GetChan
func (b *Broker) GetChan[T any](ctx context.Context, router Route[T]) (chan Msg[T], error) {
	Sugar.Debugw("broker getting channel", "route", router.Name, "client_type", fmt.Sprintf("%T", b.broker))
	switch client := any(b.broker).(type) {
	case *BrokerChan:
		return client.GetChan(ctx, router)
	case *RabbitBroker:
		return nil, errors.New("rabbit Broker no have this method GetChan")
	default:
		return nil, errors.New("broker how getchan?")
	}
}

func (b *Broker) Publish[T any](ctx context.Context, router Route[T], msg T) error {
	Sugar.Debugw("broker publishing message", "route", router.Name, "client_type", fmt.Sprintf("%T", b.broker))
	switch client := any(b.broker).(type) {
	case *BrokerChan:
		return client.Publish(ctx, router, msg)
	case *RabbitBroker:
		return client.Publish(ctx, router, msg)
	default:
		return errors.New("broker how publish?")
	}
}

func (b *Broker) NewQueue[T any](cap int, router Route[T]) error {
	Sugar.Debugw("broker creating new queue", "route", router.Name, "capacity", cap, "client_type", fmt.Sprintf("%T", b.broker))
	switch client := any(b.broker).(type) {
	case *BrokerChan:
		return client.NewQueue(cap, router)

	case *RabbitBroker:
		return client.NewQueue(cap, router)

	default:
		return errors.New("broker how newqueue?")
	}
}

func (b *Broker) Close() error {
	Sugar.Debugw("broker closing", "client_type", fmt.Sprintf("%T", b.broker))
	switch client := any(b.broker).(type) {
	case *BrokerChan:
		return client.Close()
	case *RabbitBroker:
		return client.Close()
	default:
		return errors.New("broker how close?")
	}
}

func (b *Broker) Consume[T any](ctx context.Context, router Route[T], handler func(context.Context, T) error) error {
	Sugar.Debugw("broker starting consumer", "route", router.Name, "client_type", fmt.Sprintf("%T", b.broker))
	switch client := any(b.broker).(type) {
	case *BrokerChan:
		return client.Consume(ctx, router, handler)
	case *RabbitBroker:
		return client.Consume(ctx, router, handler)
	default:
		return errors.New("broker how consume?")
	}
}
