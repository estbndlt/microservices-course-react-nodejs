import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const rsp = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const rsp = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user provides an invalid title or price', async () => {
  const cookie = global.signup();

  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket if payload is valid', async () => {
  const cookie = global.signup();

  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  let ticketRsp = await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(200);

  expect(ticketRsp.body.title).toEqual('concert');
  expect(ticketRsp.body.price).toEqual(20);

  ticketRsp = await request(app).get(`/api/tickets/${rsp.body.id}`).expect(200);

  expect(ticketRsp.body.title).toEqual('concert');
  expect(ticketRsp.body.price).toEqual(20);
});

it('publishes an event', async () => {
  const cookie = global.signup();

  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  let ticketRsp = await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(200);

  expect(ticketRsp.body.title).toEqual('concert');
  expect(ticketRsp.body.price).toEqual(20);

  ticketRsp = await request(app).get(`/api/tickets/${rsp.body.id}`).expect(200);

  expect(ticketRsp.body.title).toEqual('concert');
  expect(ticketRsp.body.price).toEqual(20);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects a ticket update if ticket is reserved', async () => {
  const cookie = global.signup();

  const rsp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: 10,
    })
    .expect(201);

  const ticket = await Ticket.findById(rsp.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  let ticketRsp = await request(app)
    .put(`/api/tickets/${rsp.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(400);
});
