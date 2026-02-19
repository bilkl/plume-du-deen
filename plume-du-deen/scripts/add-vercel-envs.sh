#!/usr/bin/env bash
# Add Vercel environment variables non-interactively.
# Usage:
#   export VERCEL_TOKEN=your_token
#   ./scripts/add-vercel-envs.sh prj_quLON10SipOSyqzLVSYjNrTFaA1G
# The script will read values from environment variables if set (recommended),
# otherwise it will prompt you to enter them.

set -euo pipefail

PROJECT_ID=${1:-}
if [ -z "$PROJECT_ID" ]; then
  echo "Usage: $0 <VERCEL_PROJECT_ID>"
  exit 1
fi

API_URL="https://api.vercel.com/v9/projects/$PROJECT_ID/env"

VARS=(
  RESEND_API_KEY
  FROM_EMAIL
  ADMIN_EMAIL
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  PAYPAL_CLIENT_ID
  PAYPAL_CLIENT_SECRET
  FRONTEND_URL
  NODE_ENV
)

# If no VERCEL_TOKEN is provided, we'll try to use the vercel CLI (requires you to be logged in via `vercel login`).
USE_CLI=false
if [ -z "${VERCEL_TOKEN:-}" ]; then
  if command -v vercel >/dev/null 2>&1; then
    if vercel whoami >/dev/null 2>&1; then
      echo "No VERCEL_TOKEN set — will use logged-in vercel CLI to add envs."
      USE_CLI=true
    else
      echo "No VERCEL_TOKEN set and vercel CLI not logged in. Run 'vercel login' or set VERCEL_TOKEN and retry."
      exit 1
    fi
  else
    echo "No VERCEL_TOKEN set and vercel CLI not installed. Install with 'npm i -g vercel' or set VERCEL_TOKEN."
    exit 1
  fi
fi

for KEY in "${VARS[@]}"; do
  # If the variable is already exported in the environment, use it.
  if [ -n "${!KEY:-}" ]; then
    VALUE="${!KEY}"
    echo "Using existing environment value for $KEY"
  else
    # Secrets should be entered silently
    if [[ "$KEY" =~ KEY|SECRET|_KEY|PAYPAL_ ]]; then
      read -r -s -p "Enter value for $KEY: " VALUE
      echo
    else
      read -r -p "Enter value for $KEY: " VALUE
    fi
  fi

  if [ -z "$VALUE" ]; then
    echo "Skipping $KEY (empty)"
    continue
  fi

  if [ "$USE_CLI" = true ]; then
    echo "Adding $KEY via vercel CLI (production)..."
    # vercel env add will prompt for input; pipe the value to it so it's non-interactive
    printf "%s\n" "$VALUE" | vercel env add "$KEY" production || {
      echo "Failed to add $KEY via vercel CLI."
      continue
    }
    echo "$KEY added via CLI."
  else
    # Check if key already exists
    EXISTING=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "$API_URL" | grep -o "\"key\": \"$KEY\"" || true)
    if [ -n "$EXISTING" ]; then
      echo "$KEY already set in project $PROJECT_ID — skipping (to overwrite, remove it in the Vercel dashboard or use the API to delete then re-add)."
      continue
    fi

    echo "Adding $KEY to project $PROJECT_ID via API (target=production)..."
    payload=$(jq -n --arg k "$KEY" --arg v "$VALUE" '{key:$k, value:$v, target:["production"]}')

    resp=$(curl -s -w "%{http_code}" -o /tmp/vercel_env_resp.json -X POST "$API_URL" \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$payload")

    http_code=$resp
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
      echo "$KEY added successfully."
    else
      echo "Failed to add $KEY — HTTP $http_code. Response:" >&2
      cat /tmp/vercel_env_resp.json >&2
    fi

    # short pause to avoid rate limits
    sleep 0.3
  fi
done

if [ "${VERCEL_TOKEN:-}" ]; then
  echo "Done. List environment variables with:\n  curl -H 'Authorization: Bearer $VERCEL_TOKEN' https://api.vercel.com/v9/projects/$PROJECT_ID/env | jq ."
else
  echo "Done. List environment variables with the vercel CLI:\n  vercel env ls --scope $(vercel whoami)"
fi
