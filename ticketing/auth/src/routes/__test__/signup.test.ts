import request from 'supertest';
import { app } from '../../app';

it.each`
  payload                                                 | expectedStatusCode | description
  ${{ email: 'valid@example.com', password: 'P@ssw0rd' }} | ${201}             | ${'valid payload'}
  ${{ email: 'invalid', password: 'P@ssw0rd' }}           | ${400}             | ${'invalid email'}
  ${{ email: 'valid@example.com', password: 'P' }}        | ${400}             | ${'invalid password'}
  ${{ email: '', password: '' }}                          | ${400}             | ${'invalid payload'}
  ${{}}                                                   | ${400}             | ${'no payload'}
`(
  'return $expectedStatusCode with $description (payload: $payload)',
  async ({ payload, expectedStatusCode }) => {
    return request(app)
      .post('/api/users/signup')
      .send(payload)
      .expect(expectedStatusCode);
  }
);

it('returns 400 with account already created', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
