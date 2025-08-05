import { useTickets, useCreateTicket, useDeleteTicket } from '../../hooks/TicketsQueries';
import { useState } from 'react';

export default function TicketsAdmin() {
  const { data: tickets, isLoading } = useTickets();
  const createTicket = useCreateTicket();
  const deleteTicket = useDeleteTicket();
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <form onSubmit={e => { e.preventDefault(); createTicket.mutate(newTicket); }} className="mb-4">
        <input className="border p-2 mr-2" value={newTicket.title} onChange={e => setNewTicket({ ...newTicket, title: e.target.value })} placeholder="Title" />
        <input className="border p-2 mr-2" value={newTicket.description} onChange={e => setNewTicket({ ...newTicket, description: e.target.value })} placeholder="Description" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {tickets?.content?.map((ticket: any) => (
            <li key={ticket.id} className="flex items-center justify-between border-b py-2">
              <span>{ticket.title}</span>
              <button className="text-red-500" onClick={() => deleteTicket.mutate(ticket.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
