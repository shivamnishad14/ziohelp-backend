import React, { useState } from 'react';

interface HelpWidgetProps {
  productId?: number;
  themeColor?: string;
}

const HelpWidget: React.FC<HelpWidgetProps> = ({ productId, themeColor = '#2563eb' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticket, setTicket] = useState({ email: '', subject: '', description: '' });
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [tab, setTab] = useState<'help' | 'ai'>('help');
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  // Search FAQ/KB
  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/faq/search?query=${encodeURIComponent(search)}${productId ? `&productId=${productId}` : ''}`);
      const data = await res.json();
      setResults(data.content || data); // support paginated or array
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  // Submit ticket
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/tickets/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticket, productId }),
      });
      setTicketSuccess(true);
      setTicket({ email: '', subject: '', description: '' });
    } catch {}
    setLoading(false);
  };

  // AI chat handler
  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiMessages(msgs => [...msgs, { role: 'user', text: aiInput }]);
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiInput, productId }),
      });
      const data = await res.json();
      setAiMessages(msgs => [...msgs, { role: 'ai', text: data.reply || data.answer || JSON.stringify(data) }]);
    } catch {
      setAiMessages(msgs => [...msgs, { role: 'ai', text: 'Sorry, something went wrong.' }]);
    }
    setAiInput('');
    setAiLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: themeColor,
          color: '#fff',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
        aria-label="Open Help Widget"
      >
        ?
      </button>
      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.2)',
          zIndex: 10000,
        }} onClick={() => setOpen(false)}>
          <div
            style={{
              position: 'absolute',
              right: 32,
              bottom: 96,
              width: 360,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              padding: 24,
              minHeight: 320,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: themeColor }}>Help Center</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
              <button onClick={() => setTab('help')} style={{ background: tab === 'help' ? themeColor : '#f3f4f6', color: tab === 'help' ? '#fff' : themeColor, border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}>FAQ/KB</button>
              <button onClick={() => setTab('ai')} style={{ background: tab === 'ai' ? themeColor : '#f3f4f6', color: tab === 'ai' ? '#fff' : themeColor, border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}>AI Chat</button>
            </div>
            {tab === 'help' ? (
              <>
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={{ width: '100%', margin: '16px 0', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                />
                <button
                  onClick={handleSearch}
                  style={{ background: themeColor, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', marginBottom: 8 }}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }}>
                  {results.length === 0 && !loading && <div style={{ color: '#888', fontSize: 14 }}>No results yet.</div>}
                  {results.map((item, i) => (
                    <details key={i} style={{ marginBottom: 8 }}>
                      <summary style={{ cursor: 'pointer', color: themeColor }}>{item.question || item.title}</summary>
                      <div style={{ fontSize: 14, marginTop: 4 }}>{item.answer || item.content}</div>
                    </details>
                  ))}
                </div>
                <button
                  onClick={() => setShowTicketForm(true)}
                  style={{ background: '#f3f4f6', color: themeColor, border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
                >
                  Can't find what you need? Create a ticket
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: 260 }}>
                <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafb', borderRadius: 6, padding: 8, marginBottom: 8 }}>
                  {aiMessages.length === 0 && <div style={{ color: '#888', fontSize: 14 }}>Ask anything about our product or support.</div>}
                  {aiMessages.map((msg, i) => (
                    <div key={i} style={{ margin: '6px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      <span style={{ display: 'inline-block', background: msg.role === 'user' ? themeColor : '#e5e7eb', color: msg.role === 'user' ? '#fff' : '#222', borderRadius: 8, padding: '6px 12px', maxWidth: '80%', wordBreak: 'break-word' }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAiSend} style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Type your question..."
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                    disabled={aiLoading}
                  />
                  <button type="submit" style={{ background: themeColor, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }} disabled={aiLoading || !aiInput.trim()}>
                    {aiLoading ? '...' : 'Send'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HelpWidget; 


// import HelpWidget from '@/components/help-widget/HelpWidget';

// // In your main App or wherever you want the widget:
// <HelpWidget productId={123} themeColor="#2563eb" />