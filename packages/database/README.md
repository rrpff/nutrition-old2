# @nutrition/database

## Development setup

```sh
# Run the following to set up supabase locally
# It will take a while to complete
npx supabase init

# Once the above is completed, copy the logged info into a `.env` file matching this:

# SUPABASE_URL=http://localhost:8000
# SUPABASE_ANON_KEY=xxxxxxxxx
# SUPABASE_SERVICE_KEY=xxxxxxxxx
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
# EMAIL_TESTING_URL=http://localhost:9000

# Run the following to start the local stack
npm start

# Run the following to stop it
npm run stop
```
