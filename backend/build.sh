#!/usr/bin/env bash
set -euo pipefail

# Upgrade pip and install requirements
python -m pip install --upgrade pip
pip install -r requirements.txt

# Run migrations and collect static files
python manage.py migrate --noinput
python manage.py collectstatic --no-input

# Optionally create a superuser if ADMIN_* env vars are provided and no superuser exists
if [ -n "${ADMIN_USERNAME:-}" ] && [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  python manage.py shell <<PY
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('${ADMIN_USERNAME}', '${ADMIN_EMAIL}', '${ADMIN_PASSWORD}')
    print('Superuser created')
else:
    print('Superuser already exists')
PY
fi
