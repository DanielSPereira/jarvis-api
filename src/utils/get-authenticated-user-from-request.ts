import type { FastifyRequest } from "fastify";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export function getAuthenticatedUserFromRequest(request: FastifyRequest) {
  const user = request.user

  if (!user) {
    throw new Error('Invalid authentication')
  }

  return user
}

export async function getAuthenticatedDataBaseUserFromRequest(request: FastifyRequest) {
  const user = request.user

  if (!user) {
    throw new Error('Invalid authentication')
  }

  const [userFromDb] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.sub))

  return userFromDb
}