import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'
import { env } from "../../../env.ts";

type JWTPayload = {
  sub: string
}

export async function checkRequestJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization

  if (!token) return reply.status(401).send()
  
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload
    
    request.user = payload
  } catch (e) {
    return reply.status(401).send()
  }
}