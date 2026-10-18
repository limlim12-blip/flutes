.PHONY: u d l 

u:
	@mkdir -p logs
	docker compose down 
	docker compose up --build -d 
	@echo "Piping container logs..."
	@docker compose logs -f --no-color --no-log-prefix gluetun >> ./logs/gluetun.log 2>&1 &
	@docker compose logs -f --no-color --no-log-prefix db >> ./logs/db.log 2>&1 &
	@docker compose logs -f --no-color --no-log-prefix api >> ./logs/api.log 2>&1 &
	@echo "Logs are being written to ./logs/gluetun.log and ./logs/db.log"

d:
	docker compose down

l:
	docker compose logs -f

backup:
	@mkdir -p /home/lim/Projects/backup/flute
	docker exec -t golang-db-1 pg_dump -U postgres -F c -d postgres > /home/lim/Projects/backup/flute/postgres_backup_$$(date +%Y%m%d_%H%M%S).dump
	@echo "Database backed up"
