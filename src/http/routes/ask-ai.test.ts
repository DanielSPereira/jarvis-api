import { expect, test, vi } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

test('ask-ai return 200 and streams AI response if user is authenticated and has enough tokens', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser(undefined, 1000)

  const response = await request(server.server)
    .post(`/ask-ai`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ question: 'hi' })

  const responseText = response.text
    
    
  expect(response.status).toEqual(200)
  expect(response.headers['content-type']).toContain('text/plain')
  expect(responseText).toEqual(expect.any(String))
  expect(responseText.length).toBeGreaterThan(0)
}, 15000) // Increase timeout for streaming response

test('ask-ai return 200 with message if user has no tokens', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser(undefined, 0)

  const response = await request(server.server)
    .post(`/ask-ai`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ question: 'hi, how are you?' })

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})

test('ask-ai return 401 if user is not authenticated', async () => {
  await server.ready()

  const response = await request(server.server)
    .post(`/ask-ai`)
    .set('Content-Type', 'application/json')
    .send({ question: 'hi, how are you?' })

  expect(response.status).toEqual(401)
})

test('ask-ai return 500 when streamObject fails', async () => {
  vi.doMock('ai', () => ({
    tool: vi.fn(),
    streamText: vi.fn(() => {
      throw new Error('AI service unavailable')
    })
  }))
  vi.resetModules()

  const { server: testServer } = await import('../app.ts')

  await testServer.ready()

  const { token } = await makeAuthenticatedUser(undefined, 1000)

  const response = await request(testServer.server)
    .post(`/ask-ai`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ question: 'hi' })

  expect(response.status).toEqual(500)
  expect(response.body).toEqual({
    message: expect.any(String)
  })

  vi.restoreAllMocks()
  vi.resetModules()
}, 15000)

