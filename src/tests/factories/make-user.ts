import { db } from '../../database/client.ts'
import { users } from '../../database/schema.ts'
import { faker } from '@faker-js/faker'
import { createJWT } from '../../services/create-jwt.ts'

export async function makeUser(email?: string) {
  const result = await db.insert(users).values({
    name: faker.person.firstName(),
    email: email ?? faker.internet.email(),
  }).returning()

  return result[0]
}

export async function makeAuthenticatedUser () {
  const user = await makeUser()
  const token = createJWT({ sub: user.id })

  return { user, token }
}