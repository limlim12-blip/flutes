.PHONY: u d l 

u:
	@mkdir -p logs
	docker compose down 
	docker compose up --build -d 
	@echo "Piping container logs..."
	@docker compose logs -f --no-log-prefix gluetun >> ./logs/gluetun.log 2>&1 &
	@docker compose logs -f --no-log-prefix db >> ./logs/db.log 2>&1 &
	@docker compose logs -f --no-log-prefix api >> ./logs/api.log 2>&1 &
	@echo "Logs are being written to ./logs/gluetun.log and ./logs/db.log"

d:
	docker compose down

l:
	docker compose logs -f

