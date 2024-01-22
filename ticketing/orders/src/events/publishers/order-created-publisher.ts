import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@estbndlt-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
