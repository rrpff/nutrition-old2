import sql, { SQLStatement } from 'sql-template-strings'
import { Client as PostgresClient } from 'pg'
import { supabaseTestClient } from './supabaseTestClient'
import { generateEmail, generatePassword } from './generators'

export const runSupabaseTestDatabaseQuery = async (query: SQLStatement) => {
  const db = new PostgresClient({ connectionString: process.env.SUPABASE_TEST_DATABASE_URL })
  await db.connect()
  await db.query(query)
  await db.end()
}

export const createTestSupabaseUser = async () => {
  const email = generateEmail()
  const password = generatePassword()

  const { error } = await supabaseTestClient.auth.signUp({ email, password })
  if (error) throw error

  await supabaseTestClient.auth.signOut()

  return {
    email,
    password,
  }
}

export const confirmTestSupabaseUserEmail = async (email: string) => {
  await runSupabaseTestDatabaseQuery(sql`
    UPDATE auth.users
    SET confirmed_at = NOW()
    WHERE email = ${email};
  `)
}

export const cleanSupabaseTestDatabase = async () => {
  await runSupabaseTestDatabaseQuery(sql`
    DELETE FROM auth.users
    WHERE email LIKE 'jest-user-%@example.com';

    DELETE FROM profiles
    WHERE user_id NOT IN (SELECT id FROM auth.users);
  `)
}
