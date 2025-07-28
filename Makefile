# Makefile for building and deploying the hack-me/frontend service

# --- Configuration ---
# Set your AWS and project details here
AWS_REGION      := ap-southeast-1
ECR_REGISTRY    := 004843574486.dkr.ecr.$(AWS_REGION).amazonaws.com
REPO_NAME       := hack-me/frontend
IMAGE_TAG       := latest

# --- Commands ---
# Default command to run when you just type "make"
.PHONY: all
all: deploy

## -----------------------------------------------------------------------------
## SVELTEKIT CHECKS
## -----------------------------------------------------------------------------

.PHONY: check
check:
	@echo "✅ Running SvelteKit checks..."
	pnpm check
	pnpm format --check
# 	pnpm lint

## -----------------------------------------------------------------------------
## DOCKER & ECR DEPLOYMENT
## -----------------------------------------------------------------------------

.PHONY: clean-ecr
clean-ecr:
	@echo "🧹 Cleaning all previous images in ECR repository: $(REPO_NAME)..."
	@IDS_TAGGED=$$(aws ecr list-images --repository-name $(REPO_NAME) --region $(AWS_REGION) --filter "tagStatus=TAGGED" --query 'imageIds[*]' --output json); \
	if [ "$$IDS_TAGGED" != "[]" ] && [ "$$IDS_TAGGED" != "null" ]; then \
		echo "Deleting tagged images..."; \
		aws ecr batch-delete-image \
			--repository-name $(REPO_NAME) \
			--region $(AWS_REGION) \
			--image-ids "$$IDS_TAGGED" > /dev/null; \
	else \
		echo "No tagged images to delete."; \
	fi
	@IDS_UNTAGGED=$$(aws ecr list-images --repository-name $(REPO_NAME) --region $(AWS_REGION) --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json); \
	if [ "$$IDS_UNTAGGED" != "[]" ] && [ "$$IDS_UNTAGGED" != "null" ]; then \
		echo "Deleting untagged images..."; \
		aws ecr batch-delete-image \
			--repository-name $(REPO_NAME) \
			--region $(AWS_REGION) \
			--image-ids "$$IDS_UNTAGGED" > /dev/null; \
	else \
		echo "No untagged images to delete."; \
	fi

.PHONY: build
build:
	@echo "🛠️  Building Docker image for linux/amd64..."
	docker build --platform linux/amd64 -t $(REPO_NAME):$(IMAGE_TAG) .

.PHONY: tag
tag:
	@echo "🏷️  Tagging image for ECR..."
	docker tag $(REPO_NAME):$(IMAGE_TAG) $(ECR_REGISTRY)/$(REPO_NAME):$(IMAGE_TAG)

.PHONY: push
push:
	@echo "🚀 Pushing image to ECR..."
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REGISTRY)
	docker push $(ECR_REGISTRY)/$(REPO_NAME):$(IMAGE_TAG)
	@echo "✅ Successfully deployed to $(ECR_REGISTRY)/$(REPO_NAME):$(IMAGE_TAG)"


## -----------------------------------------------------------------------------
## MAIN DEPLOYMENT COMMAND
## -----------------------------------------------------------------------------

.PHONY: deploy
deploy: check clean-ecr build tag push