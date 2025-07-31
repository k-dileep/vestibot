'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMic, FiSend } from 'react-icons/fi';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: "Hello! I am VestiBot, your virtual health expert specializing in Vestige products. Please describe your health concern, and I will recommend a suitable product for you.",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const previousInputRef = useRef('');
  const inputRef = useRef(null);
  const wasListeningRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setInput(previousInputRef.current + (previousInputRef.current ? ' ' : '') + transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (!listening && wasListeningRef.current) {
      inputRef.current?.focus();
    }
    wasListeningRef.current = listening;
  }, [listening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    previousInputRef.current = input;
    resetTranscript();
    SpeechRecognition.startListening();
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                messages: updatedMessages.map(m => ({ 
                    role: m.role === 'bot' ? 'assistant' : m.role, 
                    content: m.content 
                })) 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const botMessage = { id: Date.now() + 1, role: 'bot', content: data.reply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } else {
            const errorBotMessage = { id: Date.now() + 1, role: 'bot', content: data.error || 'Sorry, something went wrong.' };
            setMessages(prevMessages => [...prevMessages, errorBotMessage]);
        }
    } catch (error) {
        const errorBotMessage = { id: Date.now() + 1, role: 'bot', content: 'Failed to connect to the server. Please check your connection.' };
        setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="mt-[80px] flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800 pb-32">
        <div className="px-4 md:px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
              </div>
            )}
            <div className={`p-3 md:p-4 rounded-2xl ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none max-w-sm md:max-w-md' 
                : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none max-w-sm md:max-w-2xl'
            }`}>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="relative max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message VestiBot..."
            className="w-full pl-4 pr-20 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={() => (listening ? SpeechRecognition.stopListening() : startListening())}
                className={`p-2 rounded-full transition-colors ${
                  listening
                    ? 'bg-gray-200 text-blue-500'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiMic size={20} />
              </button>
            )}
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            <FiSend size={20} />
          </button>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          VestiBot can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
