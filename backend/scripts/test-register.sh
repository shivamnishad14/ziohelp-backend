#!/usr/bin/env bash
# Windows users: run with Git Bash or convert to .ps1 for PowerShell
# This script registers a user via the backend API and prints the result

API_URL="http://localhost:8080/api/auth/register"
PAYLOAD='{
    "email": "shivam@gmail.com",
    "password": "Shivam@123",
    "fullName": "shivam",
    "username": "shivamnishad",
    "role": "ADMIN"
}'

# Use curl to POST the registration payload
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD" \
     -v
