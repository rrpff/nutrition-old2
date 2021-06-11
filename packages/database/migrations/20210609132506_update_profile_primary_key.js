const sql = ([s]) => s

exports.up = knex => knex.raw(sql`
  ALTER TABLE ONLY profiles DROP CONSTRAINT profiles_pkey;
  CREATE UNIQUE INDEX profiles_user_id ON profiles (user_id);
  ALTER TABLE ONLY profiles ADD CONSTRAINT profiles_unique_user_id UNIQUE USING INDEX profiles_user_id;
  ALTER TABLE ONLY profiles ADD PRIMARY KEY (user_id)
`)

exports.down = knex => knex.raw(sql`
  ALTER TABLE ONLY profiles DROP CONSTRAINT profiles_pkey;
  ALTER TABLE ONLY profiles DROP CONSTRAINT profiles_unique_user_id;
  ALTER TABLE ONLY profiles ADD PRIMARY KEY (id);
`)
