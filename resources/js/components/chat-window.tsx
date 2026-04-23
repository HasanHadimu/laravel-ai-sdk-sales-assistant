// resources/js/components/chat-window.tsx
import { marked } from "marked";
import { useState, useRef, useEffect } from "react";
import {
    Send,
    X,
    Minimize2,
    Maximize2,
    Bot,
    User,
    Loader2,
    MessageSquare,
    History,
    PlusCircle,
    Copy,
    Check,
    ThumbsUp,
    ThumbsDown,
    Sparkles,
    ShoppingBag,
    Tag,
    Package,
    Zap,
    Clock,
    Menu
} from "lucide-react";

type ChatMessage = {
    id?: number;
    role: 'user' | 'assistant';
    text: string;
    time: string;
    timestamp?: Date;
};

type Conversation = {
    id: string;
    title: string;
    created_at: string;
    message_count?: number;
};

// Mobile menu component
function MobileMenu({ onNewChat, onToggleHistory, conversationCount }: {
    onNewChat: () => void;
    onToggleHistory: () => void;
    conversationCount: number;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                        <button
                            onClick={() => {
                                onNewChat();
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Chat
                        </button>
                        <button
                            onClick={() => {
                                onToggleHistory();
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <History className="w-4 h-4" />
                            History
                            {conversationCount > 0 && (
                                <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-xs">
                                    {conversationCount}
                                </span>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function ChatHeader({
    toggleId,
    onNewChat,
    onToggleHistory,
    showHistory,
    conversationCount
}: {
    toggleId: string;
    onNewChat: () => void;
    onToggleHistory: () => void;
    showHistory: boolean;
    conversationCount: number;
}) {
    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 md:px-5 md:py-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 md:p-2 rounded-full">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold">
                        Atelier AI
                    </p>
                    <h2 className="text-sm md:text-lg font-bold text-slate-900">
                        Sales Assistant
                    </h2>
                </div>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2">
                <button
                    onClick={onNewChat}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New Chat
                </button>
                <button
                    onClick={onToggleHistory}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100"
                >
                    <History className="w-3.5 h-3.5" />
                    {conversationCount > 0 && (
                        <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs">
                            {conversationCount}
                        </span>
                    )}
                </button>
                <label
                    htmlFor={toggleId}
                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100"
                >
                    Close
                </label>
            </div>

            {/* Mobile menu */}
            <MobileMenu
                onNewChat={onNewChat}
                onToggleHistory={onToggleHistory}
                conversationCount={conversationCount}
            />
        </header>
    );
}

function ConversationHistory({
    conversations,
    currentId,
    onSelect,
    onClose
}: {
    conversations: Conversation[];
    currentId: string | null;
    onSelect: (id: string) => void;
    onClose: () => void;
}) {
    return (
        <div className="absolute left-2 right-2 md:left-0 md:right-0 top-full mt-2 mx-0 md:mx-5 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-3 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Conversation History
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-6 text-center">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No conversations yet</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`w-full p-3 text-left transition-all border-b border-slate-100 hover:bg-slate-50 ${
                                currentId === conv.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                            }`}
                        >
                            <p className="text-sm font-medium text-slate-900 flex items-center gap-2 truncate">
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{conv.title}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(conv.created_at).toLocaleDateString()}
                                </p>
                                {conv.message_count && (
                                    <p className="text-xs text-slate-400">
                                        {conv.message_count} messages
                                    </p>
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

function ChatBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';
    const messageHtml = marked.parse(message?.text || '');
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex gap-2 md:gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
            {!isUser && (
                <div className="flex-shrink-0">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                        <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                </div>
            )}

            <div className={`max-w-[85%] md:max-w-[80%] ${isUser ? 'order-first' : ''}`}>
                <div
                    className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm ${
                        isUser
                            ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-tr-sm'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                    }`}
                >
                    <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''} prose-p:mb-1 prose-p:text-sm`}>
                        <div dangerouslySetInnerHTML={{ __html: messageHtml }} />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 mt-1">
                    <p className={`text-[10px] md:text-xs text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                        {message.time}
                    </p>

                    {!isUser && (
                        <div className="flex items-center gap-0.5 md:gap-1">
                            <button
                                onClick={handleCopy}
                                className="p-0.5 md:p-1 rounded hover:bg-slate-100 transition-colors"
                                title="Copy response"
                            >
                                {copied ? (
                                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500" />
                                ) : (
                                    <Copy className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setFeedback('like')}
                                className={`p-0.5 md:p-1 rounded hover:bg-slate-100 transition-colors ${
                                    feedback === 'like' ? 'text-emerald-500' : 'text-slate-400'
                                }`}
                                title="Helpful"
                            >
                                <ThumbsUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </button>
                            <button
                                onClick={() => setFeedback('dislike')}
                                className={`p-0.5 md:p-1 rounded hover:bg-slate-100 transition-colors ${
                                    feedback === 'dislike' ? 'text-red-500' : 'text-slate-400'
                                }`}
                                title="Not helpful"
                            >
                                <ThumbsDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isUser && (
                <div className="flex-shrink-0">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center shadow-md">
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                </div>
            )}
        </div>
    );
}

function QuickActions({ onSelect }: { onSelect: (message: string) => void }) {
    const actions = [
        { icon: Package, label: "Produk", message: "tampilkan semua produk", color: "from-blue-500 to-cyan-500" },
        { icon: Tag, label: "Kategori", message: "Kategori", color: "from-purple-500 to-pink-500" },
        { icon: ShoppingBag, label: "Pesanan", message: "cek pesanan saya", color: "from-orange-500 to-red-500" },
        { icon: Zap, label: "Populer", message: "produk paling populer", color: "from-yellow-500 to-amber-500" },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 mt-4">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(action.message)}
                    className={`flex items-center gap-1.5 md:gap-2 rounded-xl bg-gradient-to-r ${action.color} p-2 md:p-2.5 text-white shadow-md transition-all hover:shadow-lg hover:scale-105`}
                >
                    <action.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-[11px] md:text-xs font-medium">{action.label}</span>
                </button>
            ))}
        </div>
    );
}

export default function ChatWindow() {
    const toggleId = 'chat-toggle';
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [responses]);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const response = await fetch('/agent/conversations');
            const data = await response.json();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const startNewChat = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/agent/conversations/new', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setCurrentConversationId(data.conversation_id);
                setResponses([]);
                await loadConversations();
                setShowHistory(false);
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
        }
    };

    async function handleSend() {
        if (!message.trim()) return;
        if (isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date()
        };

        setResponses(prev => [...prev, userMessage]);
        const currentMessage = message;
        setMessage('');
        setIsLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/invoke-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: currentMessage,
                    conversation_id: currentConversationId
                }),
            });

            const data = await response.json();
            const responseText = data.response || data.message || 'Maaf, terjadi kesalahan.';

            const assistantMessage: ChatMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date()
            };

            setResponses(prev => [...prev, assistantMessage]);

            if (data.conversation_id) {
                setCurrentConversationId(data.conversation_id);
                await loadConversations();
            }

        } catch (error) {
            console.error('Error:', error);

            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date()
            };

            setResponses(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative">
            <input id={toggleId} type="checkbox" className="peer sr-only" />
            <label
                htmlFor={toggleId}
                className="group fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Chat with AI</span>
                <span className="inline md:hidden">Chat</span>
                <span className="relative">
                    <span className="absolute -top-1 -right-1 inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                </span>
            </label>

            <section className="fixed bottom-20 right-2 md:bottom-24 md:right-6 z-40 hidden w-[calc(100vw-16px)] md:w-[420px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl peer-checked:flex animate-in slide-in-from-bottom-5 fade-in duration-300">
                <ChatHeader
                    toggleId={toggleId}
                    onNewChat={startNewChat}
                    onToggleHistory={() => setShowHistory(!showHistory)}
                    showHistory={showHistory}
                    conversationCount={conversations.length}
                />

                {showHistory && (
                    <ConversationHistory
                        conversations={conversations}
                        currentId={currentConversationId}
                        onSelect={async (id) => {
                            setCurrentConversationId(id);
                            try {
                                const response = await fetch(`/agent/conversations/${id}/messages`);
                                const data = await response.json();
                                if (data.success) {
                                    const formatted = data.messages.map((msg: any) => ({
                                        id: msg.id,
                                        role: msg.role,
                                        text: msg.content,
                                        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    }));
                                    setResponses(formatted);
                                }
                            } catch (error) {
                                console.error('Error loading messages:', error);
                            }
                            setShowHistory(false);
                        }}
                        onClose={() => setShowHistory(false)}
                    />
                )}

                <div className="h-[400px] md:h-[540px] space-y-3 md:space-y-4 overflow-y-auto px-3 md:px-5 py-4 md:py-6 scrollbar-thin scrollbar-thumb-slate-300">
                    {responses.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-30"></div>
                                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 md:p-5 rounded-full shadow-lg">
                                    <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-white" />
                                </div>
                            </div>
                            <h3 className="mt-4 md:mt-6 text-base md:text-lg font-bold text-slate-900">
                                Welcome to AI Assistant
                            </h3>
                            <p className="mt-1 md:mt-2 text-xs md:text-sm text-slate-500 max-w-xs px-4">
                                Ask me about products, orders, or get recommendations.
                            </p>
                            <QuickActions onSelect={(msg) => setMessage(msg)} />
                        </div>
                    )}

                    {responses.map((message) => (
                        <ChatBubble key={message.id} message={message} />
                    ))}

                    {isLoading && (
                        <div className="flex gap-2 md:gap-3 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                                    <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 md:px-4 md:py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-emerald-500" />
                                    <span className="text-xs md:text-sm text-slate-500">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-200 bg-white/95 backdrop-blur-sm px-3 md:px-5 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onInput={e => setMessage(e.currentTarget.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask anything..."
                            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm text-slate-700 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            type="button"
                            disabled={isLoading || !message.trim()}
                            className="rounded-full bg-gradient-to-r from-slate-800 to-slate-900 p-2 md:p-2.5 text-white transition-all hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                    <p className="mt-1.5 md:mt-2 text-center text-[8px] md:text-[10px] text-slate-400">
                        AI may make mistakes. Verify important info.
                    </p>
                </div>
            </section>
        </div>
    );
}
