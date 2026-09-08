package worker

import (
	"context"
	"errors"
	"fmt"
	"lim/internal/models"
	. "lim/pkg/broker"
	. "lim/pkg/logger"
	"sync"

	"github.com/redis/go-redis/v9"
)

type Woker interface {
	Start() error
	Stop() error
	ListenAndServe() error
	GetName() string
}

type Woke struct {
	name            string
	ctx             context.Context
	cancelFn        context.CancelFunc
	running         bool
	doneChan        chan struct{}
	protest         func() error
	rdb             *redis.Client
	broker          *Broker
	controllerRoute models.Route[models.Controler]
	mu              sync.RWMutex
}

func (w *Woke) GetName() string {
	if w.name == "" {
		return "unknow"
	}
	return w.name
}

func (w *Woke) Start() error {
	w.mu.Lock()
	if w.running {
		w.mu.Unlock()
		return fmt.Errorf("worker %s is already active", w.name)
	}
	Sugar.Infow("starting worker...", "name", w.name)
	w.running = true
	w.ctx, w.cancelFn = context.WithCancel(context.Background())
	w.doneChan = make(chan struct{})
	w.mu.Unlock()

	go func() {
		Sugar.Debugw("woker goroutine launched", "name", w.name)
		defer func() {
			w.mu.Lock()
			w.running = false
			w.mu.Unlock()
			close(w.doneChan)
			Sugar.Debugw("woker goroutine cleaned up", "name", w.name)
		}()
		err := w.protest()
		if err != nil && !errors.Is(err, context.Canceled) {
			Sugar.Errorw("worker process stopped with error", "name", w.name, "error", err)
		} else {
			Sugar.Infow("worker process stoped gracefully", "name", w.name)
		}
	}()
	return nil
}

func (w *Woke) Stop() error {
	w.mu.Lock()
	if !w.running {
		w.mu.Unlock()
		return fmt.Errorf("woke %s not running", w.name)
	}
	Sugar.Debugw("cancelling woker context", "name", w.name)
	w.running = false
	cancel := w.cancelFn // -> extract first -> when canceling it can be unable to release the lock -> error -> why?
	w.mu.Unlock()
	cancel()

	Sugar.Debugw("waiting for doneChan", "name", w.name)
	<-w.doneChan
	Sugar.Infow("worker stopped cleanly", "name", w.name)
	return nil
}

func (w *Woke) ListenAndServe() error {
	// pubsub := w.rdb.Subscribe(w.ctx, models.CrawlerControl.Name)
	// defer pubsub.Close()
	// if _, err := pubsub.Receive(w.ctx); err != nil {
	// 	return fmt.Errorf("failed to subscribe to control channel: %w", err)
	// }
	// ch := pubsub.Channel()
	// ch, err := w.brokerChan.GetChan(w.ctx, w.controllerRoute)
	// if err != nil {
	// 	return fmt.Errorf("failed to get control channel: %w", err)
	// }
	Sugar.Debugw("starting woker listener", "name", w.GetName(), "route", w.controllerRoute.Name)
	wok := func(ctx context.Context, msg models.Controler) error {
		if msg == "start" {
			Sugar.Infow("received start command", "name", w.name)
			go func() {
				if err := w.Start(); err != nil {
					Sugar.Errorw("failed to start crawler", "name", w.name, "error", err)
				}
			}()
		} else if msg == "stop" {
			Sugar.Infow("received stop command", "name", w.name)
			go func() {
				if err := w.Stop(); err != nil {
					Sugar.Errorw("failed to stop crawler", "name", w.name, "error", err)
				}
			}()
		} else {
			Sugar.Warnw("unknown command received", "name", w.name, "msg", msg)
		}
		return nil
	}
	return w.broker.Consume(w.ctx, w.controllerRoute, wok)
}
