.PHONY: run
run:
	doppler run -- node build

build:
	doppler run -- pnpm build

.PHONY: check
check:
	@echo "✅ Running SvelteKit checks..."
	pnpm check
	pnpm format
	pnpm format --check
# 	pnpm lint

.PHONY: dev
dev:
	doppler run -- pnpm dev

