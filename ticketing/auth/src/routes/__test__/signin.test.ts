import request from 'supertest';
import { app } from '../../app';

it.each`
  payload                                         | expectedStatusCode | description
  ${{ email: 'invalid', password: 'P@ssw0rd' }}   | ${400}             | ${'invalid email'}
  ${{ email: 'valid@example.com', password: '' }} | ${400}             | ${'invalid password'}
  ${{ email: '', password: '' }}                  | ${400}             | ${'invalid payload'}
  ${{}}                                           | ${400}             | ${'no payload'}
`(
  'return $expectedStatusCode with $description (payload: $payload)',
  async ({ payload, expectedStatusCode }) => {
    return request(app)
      .post('/api/users/signin')
      .send(payload)
      .expect(expectedStatusCode);
  }
);

it('returns 201 with account successfully created and signed in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns 400 with account successfully created and wrong password at sign in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pizza',
    })
    .expect(400);
});

it('returns 400 with no account created and attempt to sign in', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pizza',
    })
    .expect(400);
});
