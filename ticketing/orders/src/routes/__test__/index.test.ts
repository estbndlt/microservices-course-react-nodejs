import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a specific user', async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signup();
  const userTwo = global.signup();

  // create one order as User 1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two orders as User 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders for User 2
  const rsp = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // verify the orders are only for User 2
  expect(rsp.body.length).toEqual(2);
  expect(rsp.body[0].id).toEqual(orderOne.id);
  expect(rsp.body[1].id).toEqual(orderTwo.id);
  expect(rsp.body[0].ticket.id).toEqual(orderOne.ticket.id);
  expect(rsp.body[1].ticket.id).toEqual(orderTwo.ticket.id);
  expect(rsp.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(rsp.body[1].ticket.id).toEqual(ticketThree.id);
});