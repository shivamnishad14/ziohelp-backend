import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiAPI } from '../../services/apiService';

const AIChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await aiAPI.chat({ message: msg });
      return res.data;
    },
  });

  return (
    <div>
      <h2>AI Chat</h2>
      <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={() => mutation.mutate(message)}>Send</button>
      <div>
        {mutation.status === 'pending' && <span>Sending...</span>}
        {mutation.data && <pre>{JSON.stringify(mutation.data, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default AIChat;
