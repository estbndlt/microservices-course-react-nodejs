import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if ticket is not found', async () => {
  await request(app).get('/api/tickets/asdfasd').send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  const ticketRsp = await request(app)
    .get(`/api/tickets/${rsp.body.id}`)
    .send()
    .expect(200);

  expect(ticketRsp.body.title).toEqual(title);
  expect(ticketRsp.body.price).toEqual(price);
});
