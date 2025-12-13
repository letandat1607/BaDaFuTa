set -e

echo "Starting E2E database seeding..."

POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-test}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-test}
POSTGRES_DB=${POSTGRES_DB:-testdb}

export PGPASSWORD=$POSTGRES_PASSWORD

MAX_RETRIES=5
RETRY_COUNT=0

echo "Waiting for PostgreSQL..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Timeout waiting for PostgreSQL after ${MAX_RETRIES} attempts"
    echo "Debug info:"
    echo "  Host: $POSTGRES_HOST"
    echo "  Port: $POSTGRES_PORT"
    echo "  User: $POSTGRES_USER"
    echo "  Database: $POSTGRES_DB"
    exit 1
  fi
  
  echo "Waiting for postgres... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

echo "PostgreSQL is ready!"

# Create schemas
echo "Creating schemas..."
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB <<-EOSQL
    DROP SCHEMA IF EXISTS user_e2e CASCADE;
    DROP SCHEMA IF EXISTS merchant_e2e CASCADE;
    DROP SCHEMA IF EXISTS order_e2e CASCADE;
    DROP SCHEMA IF EXISTS drone_e2e CASCADE;
    
    CREATE SCHEMA user_e2e;
    CREATE SCHEMA merchant_e2e;
    CREATE SCHEMA order_e2e;
    CREATE SCHEMA drone_e2e;
EOSQL

# Seed each service
echo "Seeding user_service..."
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB < /seeds/01-user-service.sql

echo "Seeding merchant_service..."
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB < /seeds/02-merchant-service.sql

echo "Seeding order_service..."
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB < /seeds/03-order-service.sql

echo "Seeding drone_service..."
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB < /seeds/04-drone-service.sql

echo "Database seeding completed!"