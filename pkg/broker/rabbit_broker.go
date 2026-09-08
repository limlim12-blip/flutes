package broker

import (
	"context"
	"encoding/json"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	. "lim/internal/models"
)

type RabbitBroker struct {
	conn *amqp.Connection
	ch   *amqp.Channel
}

func NewRabbitBroker(url string) (*RabbitBroker, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to rabbitmq: %w", err)
	}
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %w", err)
	}
	return &RabbitBroker{
		conn: conn,
		ch:   ch,
	}, nil
}

func (r *RabbitBroker) NewQueue[T any](cap int, router Route[T]) error {
	args := amqp.Table{}
	if cap > 0 {
		args["x-max-length"] = cap
		args["x-overflow"] = "reject-publish"
	}
	_, err := r.ch.QueueDeclare(
		router.Name, // name
		true,        // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		args,        // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue %s: %w\n", router.Name, err)
	}
	return nil
}

func (r *RabbitBroker) Publish[T any](ctx context.Context, router Route[T], msg T) error {
	body, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	return r.ch.PublishWithContext(
		ctx,
		"",          // default exchange
		router.Name, // routing
		false,       // mandatory
		false,       // immediate
		amqp.Publishing{
			ContentType:  "application/json",
			DeliveryMode: amqp.Persistent, // matches durable queue
			Body:         body,
		},
	)
}

func (r *RabbitBroker) Consume[T any](ctx context.Context, router Route[T], handler func(context.Context, T) error) error {
	deliveries, err := r.ch.Consume(
		router.Name,
		"",
		false, // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		return fmt.Errorf("failed to start consumer: %w", err)
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()

		case delivery, ok := <-deliveries:
			if !ok {
				return nil
			}

			var msg T
			if err := json.Unmarshal(delivery.Body, &msg); err != nil {
				delivery.Nack(false, false)
				continue
			}

			if err := handler(ctx, msg); err != nil {
				delivery.Nack(false, true)
			} else {
				delivery.Ack(false)
			}
		}
	}
}

func (r *RabbitBroker) Close() error {
	if r.ch != nil {
		r.ch.Close()
	}
	if r.conn != nil {
		return r.conn.Close()
	}
	return nil
}
