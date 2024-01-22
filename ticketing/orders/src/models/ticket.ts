import mongoose, { Document, Model } from 'mongoose';

// An interface that describes the properties
// required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties
// that a Ticket Document has
export interface TicketDocument extends Document {
  title: string;
  price: number;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
