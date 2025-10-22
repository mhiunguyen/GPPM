import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatBotProps {
  analysisContext?: {
    primary_diagnosis?: string;
    confidence?: number;
    risk_level?: string;
    symptoms?: string[];
  } | null;
  language?: string;
  mode?: 'floating' | 'inline';
  className?: string;
}

export default function ChatBot({ analysisContext, language = 'vi', mode = 'floating', className }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message when opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: language === 'vi' 
          ? '👋 Xin chào! Tôi là trợ lý AI của DermaSafe. Tôi có thể giúp bạn:\n\n• Giải thích kết quả phân tích\n• Tư vấn về các triệu chứng\n• Hướng dẫn chăm sóc da\n• Giải đáp thắc mắc\n\nBạn cần tôi giúp gì?'
          : '👋 Hello! I\'m DermaSafe AI assistant. I can help you with:\n\n• Explaining analysis results\n• Advising on symptoms\n• Skin care guidance\n• Answering questions\n\nHow can I help you?',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, language]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Format analysis context theo schema của chatbot service
      let formattedContext = null;
      if (analysisContext) {
        formattedContext = {
          risk: analysisContext.risk_level || 'UNKNOWN',
          reason: `Chẩn đoán: ${analysisContext.primary_diagnosis || 'N/A'}`,
          cv_scores: {},
          primary_disease: analysisContext.primary_diagnosis ? {
            name: analysisContext.primary_diagnosis,
            confidence: analysisContext.confidence || 0
          } : null,
          alternative_diseases: [],
          recommendations: [],
          clinical_concepts: analysisContext.symptoms || []
        };
      }

      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage.content,
          analysis_context: formattedContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: language === 'vi'
          ? '😔 Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
          : '😔 Sorry, an error occurred. Please try again later.',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (mode === 'floating' && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={
      mode === 'inline'
        ? `w-full h-[520px] bg-white rounded shadow-lg flex flex-col overflow-hidden border border-gray-200 ${className || ''}`
        : 'fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200'
    }>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-bold text-lg">DermaSafe AI</h3>
            <p className="text-xs text-purple-100">
              {language === 'vi' ? 'Trợ lý ảo' : 'AI Assistant'}
            </p>
          </div>
        </div>
        {mode === 'floating' && (
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              {msg.timestamp && (
                <span className={`text-xs mt-1 block ${
                  msg.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 rounded px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {language === 'vi' ? 'Đang suy nghĩ...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'vi' ? 'Nhập câu hỏi...' : 'Type your question...'}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded focus:border-purple-500 focus:outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick suggestions */}
        {analysisContext && messages.length <= 1 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 font-medium">
              {language === 'vi' ? 'Gợi ý câu hỏi:' : 'Quick questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                language === 'vi' ? 'Kết quả này nghĩa là gì?' : 'What does this result mean?',
                language === 'vi' ? 'Tôi nên làm gì tiếp theo?' : 'What should I do next?',
                language === 'vi' ? 'Có nghiêm trọng không?' : 'Is it serious?',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-full hover:bg-purple-50 hover:border-purple-400 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
