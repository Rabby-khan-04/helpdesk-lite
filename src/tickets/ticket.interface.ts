export interface Ticket {
  id: number;
  subject: string;
  description: string;
  reporterId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  createdAt: string;
}
