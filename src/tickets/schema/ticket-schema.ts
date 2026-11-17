import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(['low', 'medium', 'high']),
  reporterId: z.string(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
