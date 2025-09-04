.PHONY: run
run:
	doppler run -- node build


.PHONY: check
check:
	@echo "✅ Running SvelteKit checks..."
	pnpm check
	pnpm format
	pnpm format --check
# 	pnpm lint



