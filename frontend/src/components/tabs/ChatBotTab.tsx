import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ChatBot from '../ChatBot';

type LangKey = 'vi' | 'en';

interface ChatBotTabProps {
  language: LangKey;
  analysisContext: any;
}

export default function ChatBotTab({ language, analysisContext }: ChatBotTabProps) {
  return (
    <Card className="smooth-hover">
      <CardHeader>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-blue-600"/>
          <h3 className="text-lg font-bold text-gray-900">
            {language === 'vi' ? '💬 Trợ lý AI' : '💬 AI Assistant'}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChatBot
          mode="inline"
          analysisContext={analysisContext}
          language={language}
          className="h-[600px]"
        />
      </CardContent>
    </Card>
  );
}
