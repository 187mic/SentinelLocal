interface ChatMessageProps {
  role: 'owner' | 'assistant';
  message: string;
  timestamp?: string;
}

export default function ChatMessage({ role, message, timestamp }: ChatMessageProps) {
  const isOwner = role === 'owner';
  
  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'} mb-4`} data-testid={`message-${role}`}>
      <div className={`max-w-lg ${isOwner ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`${
          isOwner 
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm' 
            : 'bg-card text-card-foreground rounded-2xl rounded-bl-sm border border-card-border'
        } px-4 py-3`}>
          <div className="text-sm" data-testid="text-message-content">
            {message}
          </div>
        </div>
        {timestamp && (
          <div className={`text-xs text-muted-foreground mt-1 ${isOwner ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
