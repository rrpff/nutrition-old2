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

## Migrations

[Supabase seem pretty hot on using raw SQL to amend a local DB, then diffing against the production DB and running some SQL before deploys.](https://supabase.io/blog/2021/03/31/supabase-cli) However the docker image they've provided isn't working well. Would alternatively be ok with a tool like `prisma` which supports diffing instead, but [Prisma doesn't work well with Supabase right now](https://github.com/prisma/prisma/issues/1175#issuecomment-835795021).

Instead, for now, using `knex` to apply migration files manually.

To create a new migration, e.g.:

```sh
npx knex migrate:make add_something
```

To run migrations against a database, e.g.:

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres npx knex migrate:up
```
