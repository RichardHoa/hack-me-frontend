.PHONY: run
run:
	doppler run -- sh -c 'ORIGIN=https://hack-me.duckdns.org node build'

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

