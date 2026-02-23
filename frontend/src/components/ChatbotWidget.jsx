import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api/backendClient';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return <div className="text-red-500 text-xs font-mono p-2 bg-red-50 dark:bg-red-900/20 rounded">Markdown Error: {this.state.error.message}</div>;
        }
        return this.props.children;
    }
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello Administrator. I am the SUVIDHA Engine, monitoring the district telemetry in real-time. How can I assist you with the drought assessment today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // We only send the last few messages to optimize the Deepseek token window
            const conversationHistory = messages.slice(-5).concat(userMessage);

            const response = await api.post('/api/chat', {
                messages: conversationHistory
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ **System Error**: Lost connection to the AI Insight Engine. Please check if the Deepseek model is running.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-[999] size-14 bg-gradient-to-r from-blue-600 to-primary hover:scale-110 active:scale-95 transition-all duration-300 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
                aria-label="Open AI Assistant"
            >
                <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                {/* Ping Animation Indicator */}
                <span className="absolute top-0 right-0 size-3 bg-red-500 rounded-full shadow animate-ping"></span>
                <span className="absolute top-0 right-0 size-3 bg-red-500 rounded-full shadow border-2 border-white"></span>
            </button>

            {/* Chat Window Container */}
            <div
                className={`fixed bottom-6 right-6 z-[1000] w-[380px] sm:w-[420px] h-[600px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-2xl flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="size-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-sm text-white">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">SUVIDHA Engine</h3>
                            <p className="text-xs text-slate-500 font-medium">Deepseek-671B Analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar">
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar for AI */}
                                    {msg.role !== 'user' && (
                                        <div className="size-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-primary mb-1 border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-br-sm shadow-sm'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm prose prose-sm dark:prose-invert max-w-none'
                                        }`}>
                                        {msg.role === 'user' ? (
                                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                        ) : (
                                            <ErrorBoundary>
                                                <div className="text-sm leading-relaxed text-pretty">
                                                    <ReactMarkdown>
                                                        {msg.content || ""}
                                                    </ReactMarkdown>
                                                </div>
                                            </ErrorBoundary>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex flex-col items-start">
                                <div className="flex items-end gap-2 max-w-[85%]">
                                    <div className="size-7 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-primary mb-1 border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                    </div>
                                    <div className="px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-sm flex items-center gap-1.5 h-11">
                                        <span className="size-2 rounded-full bg-primary/40 animate-pulse"></span>
                                        <span className="size-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                                        <span className="size-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ask about district telemetry..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-1.5 size-9 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    </form>
                    <div className="mt-2 text-center">
                        <span className="text-[10px] text-slate-400 font-medium">Responses generated by local Deepseek models may be inaccurate.</span>
                    </div>
                </div>
            </div>
        </>
    );
}
