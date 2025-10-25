import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: 'owner' | 'assistant';
  message: string;
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'owner',
      message: "Why are my calls slow this week?",
      timestamp: '2:30 PM'
    },
    {
      id: '2',
      role: 'assistant',
      message: "We spent $417 this week, generated 12 leads, and estimated $2,050 revenue. Conversion cost looks acceptable at $34.75 per lead. Call volume is actually up 8% vs last week, but the afternoon slots are underperforming. I recommend raising bids 15% for 2-6pm to capture more emergency calls.",
      timestamp: '2:31 PM'
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'owner',
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsSending(true);

    // Mock AI response - todo: remove mock functionality
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: "Based on your current campaign data, I can help analyze that. Looking at the metrics, your campaigns are performing well overall. Is there a specific aspect you'd like me to dive deeper into?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2" data-testid="text-page-title">Marketing Manager AI</h1>
          <p className="text-sm text-muted-foreground">
            Ask questions about your campaigns, performance, and get AI-powered insights
          </p>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 space-y-4" data-testid="chat-history">
          {messages.map(msg => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground rounded-2xl rounded-bl-sm border border-card-border px-4 py-3 max-w-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-border bg-card pt-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Marketing Manager..."
              disabled={isSending}
              className="flex-1"
              data-testid="input-chat"
            />
            <Button
              type="submit"
              disabled={isSending || !input.trim()}
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
