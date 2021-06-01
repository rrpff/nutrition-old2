import { v4 as uuidv4 } from 'uuid'

export const generateEmail = () => `test-${uuidv4()}@example.com`
export const generatePassword = () => uuidv4()
