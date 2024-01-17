import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@estbndlt-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
