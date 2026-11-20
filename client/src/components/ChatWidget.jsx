import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'How do I start a mock interview?',
  'What does Skill Points unlock?',
  'How is my resume parsed?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm AJ, your SkillCortex assistant. Ask me anything about interviews, quizzes, or your profile." }
  ]);

  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typing, open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    const newMessages = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);
    setInput('');
    setTyping(true);
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, text: m.text })) })
      });
      const data = await res.json();
      if (!res.ok || !data.reply) {
        setMessages((m) => [...m, { role: 'assistant', text: data.message || 'Sorry, I could not respond right now. Please try again.' }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((m) => [...m, { role: 'assistant', text: 'I am having trouble connecting. Please check that the backend server is running.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div data-lenis-prevent className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-[#E6E2E0] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-[14px]">AJ Assistant</span>
            <span className="ml-auto text-[11px] opacity-80">Online</span>
          </div>
          <div ref={scrollRef} data-lenis-prevent className="h-72 overflow-y-auto p-4 space-y-3 bg-[#F9F8F7] scroll-smooth touch-pan-y overscroll-contain">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-[#2E2C2A] text-white rounded-br-sm' : 'bg-white border border-[#E6E2E0] text-[#2E2C2A] rounded-bl-sm shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E6E2E0] text-[#9E9894] rounded-2xl rounded-bl-sm shadow-sm px-3 py-2 text-[13px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E9894] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E9894] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E9894] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-[11.5px] px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#E6E2E0] bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask AJ anything…"
              className="flex-1 px-3 py-2 rounded-xl border border-[#E6E2E0] text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button onClick={() => send()} className="w-9 h-9 rounded-xl bg-[#2E2C2A] text-white flex items-center justify-center hover:bg-[#4F4945] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}