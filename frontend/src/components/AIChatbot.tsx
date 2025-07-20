import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, MessageCircle } from 'lucide-react';

const AI_API_URL = '/api/ai-chat'; // Adjust as needed

const AIChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    setInput('');
    try {
      const res = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.reply || 'Sorry, I could not answer that.' }]);
    } catch {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Sorry, there was an error.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
        {!open && (
          <Button size="icon" className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}>
            <MessageCircle size={28} />
          </Button>
        )}
      </div>
      {/* Chat Modal */}
      {open && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1100 }}>
          <Card className="w-80 max-h-[70vh] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X /></Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2" ref={chatRef} style={{ minHeight: 200, maxHeight: 320 }}>
              {messages.length === 0 && <div className="text-gray-400 text-sm">Ask me anything or get FAQ suggestions!</div>}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 mb-1 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
                </div>
              ))}
              {loading && <div className="text-gray-400 text-xs">AI is typing...</div>}
            </CardContent>
            <form className="flex items-center gap-2 p-2 border-t" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1"
                disabled={loading}
                autoFocus
              />
              <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIChatbot; 