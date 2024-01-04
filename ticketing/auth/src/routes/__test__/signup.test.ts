import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest',
      password: 'password',
    })
    .expect(400);
});

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
