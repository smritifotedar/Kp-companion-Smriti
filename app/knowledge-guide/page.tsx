'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What is Devgon and how is it performed?',
  'When is Herath celebrated as per KP Panchang?',
  'What is the significance of Navreh Thaal?',
  'What is the difference between KP Panchang and Hindu Panchang?',
  'What is Sapta Rishi Samvat?',
  'How is Zyeth Atham observed?',
  'What is the role of Sharika Mata in KP tradition?',
  'What are the steps of a KP wedding?',
];

export default function KnowledgeGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🙏 Namaskar! I am your Kashmiri Pandit Digital Knowledge Guide.\n\nI can answer questions about Kashmiri Pandit traditions, festivals, rituals, the Sapta Rishi Samvat (KP Panchang), and heritage.\n\nPlease note: I use knowledge grounded in authentic Kashmiri Pandit traditions. For important rituals and major life decisions, always consult a qualified KP scholar or priest.\n\nWhat would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ I encountered an error. Please try again, or ensure the AI service is configured.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '🙏 Namaskar! How can I help you with Kashmiri Pandit traditions today?',
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">ज्ञान साथी</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          AI Knowledge Guide
        </h1>
        <p className="text-earth-600 max-w-xl mx-auto text-sm">
          Ask questions about Kashmiri Pandit traditions in simple language.
          Powered by AI, grounded in authentic KP knowledge and Sapta Rishi Samvat.
        </p>
        <div className="mt-3 inline-block glass-saffron border border-amber-200 rounded-2xl px-4 py-2 text-xs text-amber-900 shadow-sm">
          ⚠️ For major rituals and life decisions, always consult a qualified KP scholar
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat window */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-earth-200 shadow-premium-lg overflow-hidden flex flex-col" style={{ height: '520px' }}>
            {/* Chat header */}
            <div className="bg-gradient-to-r from-saffron-600 to-saffron-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg">🕉</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">KP Knowledge Guide</div>
                  <div className="text-saffron-200 text-xs">Kashmiri Pandit Panchang & Traditions</div>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-saffron-200 hover:text-white hover:bg-saffron-500 transition-colors"
                title="Clear conversation"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <span className="text-sm">🕉</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-ai text-earth-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0 mr-2">
                    <span className="text-sm">🕉</span>
                  </div>
                  <div className="chat-bubble-ai px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-saffron-400 rounded-full sacred-loading"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-earth-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about KP traditions, festivals, rituals..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-gradient-to-br from-saffron-500 to-saffron-600 text-white rounded-xl hover:from-saffron-600 hover:to-saffron-700 hover:shadow-glow-saffron hover:scale-105 active:scale-95 transition-all duration-300 ease-premium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Suggested questions */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-earth-800 text-sm">
            💡 Suggested Questions
          </h3>
          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2.5 bg-white border border-earth-100 rounded-xl text-xs text-earth-700 hover:border-saffron-300 hover:bg-saffron-50 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium shadow-sm disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="bg-saffron-50 border border-saffron-100 rounded-xl p-3 text-xs text-earth-600">
            <p className="font-semibold mb-1">About this Guide</p>
            <p className="leading-relaxed">
              The AI guide is powered by Claude and trained on KP traditions,
              Sapta Rishi Samvat, and authentic community knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
