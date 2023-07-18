#!/bin/bash

# Load environment variables
source $(dirname "$0")/../.env

WEBHOOK_URL=$HEALTHCHECK_WEBHOOK

# Function to send message to Discord
send_to_discord() {
    curl -X POST $WEBHOOK_URL \
        -H "Content-Type: application/json" \
        -d '{"content": "<@&975961160488718386> No successful notifications in the last 24 hours"}' \
        && echo "Message sent to discord" \
        || echo "Error: Message not sent"
}

# Function to check logs
check_logs() {
    LOGS=$(journalctl -u ketl-notifications-backend.service --since '24 hours ago')

    if [[ $LOGS == *"success: true"* ]]; then
        echo "Logs checked successfully"
    else
        send_to_discord
    fi
}

# Call the function
check_logs