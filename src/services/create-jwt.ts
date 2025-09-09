import jwt from 'jsonwebtoken'
import { env } from '../env.ts'

type Payload = {
  sub: string
}

export function createJWT(payload: Payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' })
}