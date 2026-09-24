.PHONY: help dev seed test build docker clean

help:
	@echo "AQUA//GUARD Development Commands:"
	@echo "  make dev      - Start API (port 8000) and Next.js Web (port 3000)"
	@echo "  make seed     - Seed database with real Conduit observations & Kenyan stations"
	@echo "  make test     - Run pytest backend suite and frontend typecheck"
	@echo "  make build    - Build production packages and Next.js bundle"
	@echo "  make docker   - Run complete stack via Docker Compose"

seed:
	PYTHONPATH=. .venv/bin/python3 scripts/seed.py

test:
	PYTHONPATH=. .venv/bin/pytest apps/api/tests -v
	npm --prefix apps/web run build

build:
	npm --prefix apps/web run build

docker:
	docker compose up --build -d

clean:
	rm -rf .pytest_cache aquaguard.db apps/web/.next
