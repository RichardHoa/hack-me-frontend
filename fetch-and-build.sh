#!/bin/bash

# --- Configuration ---
SCRIPT_NAME="Deployment Script"
LOG_FILE="./deployment.log"
APP_CONFIG="ecosystem.doppler.config.cjs"

# Function to log messages to the console and the log file
log_action() {
    echo -e "\n\n--> $1" | tee -a "$LOG_FILE"
}

# Function to check the exit status of the previous command
check_error() {
    if [ $? -ne 0 ]; then
        log_action "!!! ERROR: The previous step failed. Aborting $SCRIPT_NAME."
        echo "!!! See $LOG_FILE for details."
        exit 1
    fi
}

# Clear old log file before starting new deployment
echo "--- Starting $SCRIPT_NAME on $(date) ---" > "$LOG_FILE"

# --- Step 1: Git Pull ---
log_action "1. Running git pull to fetch remote changes..."
git pull | tee -a "$LOG_FILE"
check_error

# --- Step 2: PM2 Stop All Applications ---
log_action "2. Stopping all PM2 processes..."
pm2 stop all | tee -a "$LOG_FILE"
check_error

# --- Step 3: PM2 Delete All Processes ---
log_action "3. Deleting all PM2 process definitions..."
pm2 delete all | tee -a "$LOG_FILE"
check_error

# --- Step 4: Remove 'build' Directory ---
log_action "4. Deleting old 'build' directory (rm -rf build)..."
rm -rf build
check_error

# --- Step 5: Run 'make build' ---
log_action "5. Running 'make build' to compile new application assets..."
# Note: Assuming 'make build' is available and configured.
make build | tee -a "$LOG_FILE"
check_error

# --- Step 6: Start Application via PM2 ---
log_action "6. Starting new application using PM2 config: $APP_CONFIG..."
pm2 start "$APP_CONFIG" | tee -a "$LOG_FILE"
check_error

# --- Completion ---
log_action "--- Deployment successful! New processes are running. ---"

# Display PM2 status (optional end check)
log_action "Current PM2 Status:"
pm2 status | tee -a "$LOG_FILE"

echo "Deployment complete. Check PM2 status above or review $LOG_FILE for full history."