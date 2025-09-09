import { expect, test, vi } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { sendEmail } from '../../services/send-email.ts'
import { faker } from '@faker-js/faker'
import { makeUser } from '../../tests/factories/make-user.ts'

vi.mock('../../services/send-email.ts', () => ({
  sendEmail: vi.fn()
}))

test('create account returns 201 and create an account successfully', async () => {
  await server.ready()

  const mockedSendEmail = sendEmail as unknown as ReturnType<typeof vi.fn>

  mockedSendEmail.mockResolvedValue(true)

  const generatedEmail = faker.internet.email()
  const generatedName = faker.person.firstName()

  const response = await request(server.server)
    .post(`/accounts`)
    .set('Content-Type', 'application/json')
    .send({ email: generatedEmail, name: generatedName })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})

test('create account returns 401 if the email provided is already taken', async () => {
  await server.ready()

  const mockedSendEmail = sendEmail as unknown as ReturnType<typeof vi.fn>

  mockedSendEmail.mockResolvedValue(true)

  const generatedEmail = faker.internet.email()
  const generatedName = faker.person.firstName()

  await makeUser(generatedEmail)

  const response = await request(server.server)
    .post(`/accounts`)
    .set('Content-Type', 'application/json')
    .send({ email: generatedEmail, name: generatedName })

  expect(response.status).toEqual(409)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})

test('create account returns 500 if sendEmail function throws an error', async () => {
  await server.ready()

  const mockedSendEmail = sendEmail as unknown as ReturnType<typeof vi.fn>

  mockedSendEmail.mockImplementation(() => {
    throw new Error()
  })

  const generatedEmail = faker.internet.email()
  const generatedName = faker.person.firstName()

  const response = await request(server.server)
    .post(`/accounts`)
    .set('Content-Type', 'application/json')
    .send({ email: generatedEmail, name: generatedName })

  expect(response.status).toEqual(500)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})
