import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

const createTicket = () => {
  const title = 'concert';
  const price = 20;

  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price,
    })
    .expect(201);
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const rsp = await request(app).get(`/api/tickets/`).send().expect(200);

  expect(rsp.body.length).toEqual(3);
});
