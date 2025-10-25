import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <ChatMessage
        role="owner"
        message="Why are my calls slow this week?"
        timestamp="2:30 PM"
      />
      <ChatMessage
        role="assistant"
        message="We spent $417 this week, generated 12 leads, and estimated $2,050 revenue. Conversion cost looks acceptable at $34.75 per lead. Call volume is actually up 8% vs last week, but the afternoon slots are underperforming. I recommend raising bids 15% for 2-6pm to capture more emergency calls."
        timestamp="2:31 PM"
      />
      <ChatMessage
        role="owner"
        message="What about the weekend performance?"
        timestamp="2:35 PM"
      />
    </div>
  );
}
