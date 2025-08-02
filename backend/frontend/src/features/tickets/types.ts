export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdDate: string;
  updatedDate: string;
  createdBy: {
    id: number;
    username: string;
  };
  assignedTo?: {
    id: number;
    username: string;
  };
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TicketInput {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
