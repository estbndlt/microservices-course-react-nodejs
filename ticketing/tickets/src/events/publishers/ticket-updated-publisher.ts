import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@estbndlt-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
