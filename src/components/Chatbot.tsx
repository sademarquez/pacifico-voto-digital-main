import { useRef, useState, useEffect } from "react";
import { Bot, Loader2, Minimize2, Send, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose?: () => void;
}

const Chatbot = ({ isMinimized = false, onToggleMinimize, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      content: "Hola, soy Agora, tu asistente de campaña. ¿Qué necesitas analizar o crear hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const quickReplies = [
    "Propuestas de campaña",
    "Análisis de sentimiento",
    "Estrategias de comunicación",
    "Crear cuenta de líder",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'web_user_001',
          prompt: userMessage,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la comunicación con el servidor');
      }

      const data = await response.json();
      return data; // Devolvemos el objeto completo

    } catch (error) {
      console.error('Error al contactar al cerebro Agora:', error);
      return { 
        status: 'error', 
        error: "Hubo un problema técnico con nuestro asistente. Por favor, intenta más tarde." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const botResponseData = await generateBotResponse(message);

    let botMessageContent = "Lo siento, ha ocurrido un error.";
    if (botResponseData.status === 'success') {
      botMessageContent = botResponseData.response;
    } else {
      botMessageContent = botResponseData.error;
    }
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botMessageContent,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    // --- Lógica de Redirección ---
    if (botResponseData.redirect) {
      // Damos un pequeño tiempo para que el usuario lea el mensaje antes de redirigir
      setTimeout(() => {
        navigate(botResponseData.redirect);
      }, 1500);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  if (isMinimized) {
    return (
      <Button
        onClick={onToggleMinimize}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full bg-slate-600 hover:bg-slate-700 shadow-lg"
      >
        <Bot className="h-8 w-8 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 rounded-lg shadow-xl flex flex-col bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-stone-600 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <CardTitle className="text-lg">Asistente de Campaña</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleMinimize}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Badge className="bg-white/20 text-white w-fit">
          Transparencia y Honestidad
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[400px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-slate-600 text-white'
                      : 'bg-gray-100 text-slate-800'
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 text-slate-600" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-1 text-white" />}
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-slate-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="mb-2 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-slate-600 hover:bg-slate-700">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
