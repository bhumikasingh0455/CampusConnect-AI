import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  HelpCircle,
  Calendar,
  BookOpen,
  Minimize2,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AiCampusAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm **CampusConnect AI**, your university academic assistant. I can help explain concepts, break down assignments, generate personalized study routines, or answer university attendance rules. What can I assist you with today?`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: 'Explain Raft Consensus', query: 'Explain the Raft distributed consensus protocol simply with leader election.' },
    { label: 'Weekly Study Schedule', query: 'Can you generate a balanced 7-day study timetable for a CS student?' },
    { label: 'Attendance Shortage Rules', query: 'What is the university 75% attendance policy and how are shortages calculated?' },
    { label: 'MERN Best Practices', query: 'What are the top security best practices for MERN full stack architecture?' }
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.post('/ai/chat', {
        prompt: query.trim(),
        conversationHistory: history
      });

      if (res.data.success) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.data.reply
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Sorry, I encountered an issue connecting to the AI service. Please try again.';
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `⚠️ ${errorMsg}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format basic markdown-style text safely
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Bold rendering
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline code rendering
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">$1</code>');

      if (line.startsWith('### ')) {
        return <h4 key={index} className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formattedLine.replace('### ', '') }} />;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 my-0.5" dangerouslySetInnerHTML={{ __html: formattedLine.replace('- ', '') }} />;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={index} className="ml-4 list-decimal text-xs text-slate-700 dark:text-slate-300 my-0.5" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s/, '') }} />;
      }
      return <p key={index} className="text-xs text-slate-700 dark:text-slate-300 my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl hover:shadow-glow-purple transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span className="text-sm font-bold tracking-tight">Ask Campus AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
            isExpanded ? 'w-[90vw] sm:w-[600px] h-[80vh]' : 'w-[90vw] sm:w-[420px] h-[550px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-navy-900 via-indigo-900 to-purple-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  CampusConnect AI
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
                </h3>
                <p className="text-[10px] text-slate-300">Powered by Google Gemini</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <div>{renderFormattedText(m.text)}</div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Analyzing academic knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Pills */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.query)}
                disabled={isLoading}
                className="text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors cursor-pointer flex-shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask questions about courses, assignments, or study plans..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiCampusAssistant;
