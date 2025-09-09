import { expect, test, vi } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeUser } from '../../tests/factories/make-user.ts'
import { sendEmail } from '../../services/send-email.ts'

vi.mock('../../services/send-email.ts', () => ({
  sendEmail: vi.fn()
}))

test('login sends authentication link via email successfully when existent email is sent', async () => {
  await server.ready()

  const mockedSendEmail = sendEmail as unknown as ReturnType<typeof vi.fn>

  mockedSendEmail.mockResolvedValue(true)

  const user = await makeUser()

  const response = await request(server.server)
    .post(`/sessions`)
    .set('Content-Type', 'application/json')
    .send({ email: user.email })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
}) 

test('login returns 401 if non existent email is passed', async () => {
  await server.ready()

  const response = await request(server.server)
    .post(`/sessions`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test@gmail.com' })

  expect(response.status).toEqual(401)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
}) 

test('login returns 500 if sendEmail function throws an error', async () => {
  await server.ready()

  const mockedSendEmail = sendEmail as unknown as ReturnType<typeof vi.fn>

  mockedSendEmail.mockImplementation(() => {
    throw new Error()
  })

  const user = await makeUser()

  const response = await request(server.server)
    .post(`/sessions`)
    .set('Content-Type', 'application/json')
    .send({ email: user.email })

  expect(response.status).toEqual(500)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
}) 