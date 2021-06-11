const sql = ([s]) => s

exports.up = knex => knex.raw(sql`
  ALTER TABLE ONLY profiles
  ALTER COLUMN id SET DEFAULT extensions.uuid_generate_v4();

  ALTER POLICY "Users can insert their own profile."
  ON profiles
  WITH CHECK ( auth.uid() = user_id );

  ALTER POLICY "Users can update own profile."
  ON profiles
  USING ( auth.uid() = user_id );
`)

exports.down = knex => knex.raw(sql`
  ALTER TABLE ONLY profiles
  ALTER COLUMN id DROP DEFAULT;

  ALTER POLICY "Users can insert their own profile."
  ON profiles
  WITH CHECK ( auth.uid() = id );

  ALTER POLICY "Users can update own profile."
  ON profiles
  USING ( auth.uid() = id );
`)
