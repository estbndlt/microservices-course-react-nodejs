import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@estbndlt-tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must be valid'),
    body('price')
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
