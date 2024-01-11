import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@estbndlt-tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
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

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
