import { TicketUpdatedEvent } from '@estbndlt-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  // call onMessage object with data + message object
  await listener.onMessage(data, msg);

  // verify ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data!.title);
  expect(updatedTicket!.price).toEqual(data!.price);
  expect(updatedTicket!.version).toEqual(data!.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage object with data + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack if event has skipped version number', async () => {
  const { listener, data, ticket, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
