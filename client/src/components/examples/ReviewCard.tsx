import ReviewCard from '../ReviewCard';

export default function ReviewCardExample() {
  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <ReviewCard
        id="1"
        rating={5}
        content="Amazing service! They came out at 11pm when our furnace died. Fixed it in 30 minutes. Will definitely call again!"
        sourcePlatform="google"
        status="new"
        aiSuggestedReply="Thank you so much for the kind words! We're always here 24/7 for emergencies. It was our pleasure to help get your heat back on quickly. We appreciate your business!"
        createdAt="2 hours ago"
        onApprove={(id) => console.log('Approved review:', id)}
        onEscalate={(id) => console.log('Escalated review:', id)}
      />
      
      <ReviewCard
        id="2"
        rating={4}
        content="Good work but a bit pricey for what was done. Tech was professional though."
        sourcePlatform="google"
        status="new"
        aiSuggestedReply="We appreciate your feedback! Our pricing reflects our 24/7 availability and certified technicians. We're glad you had a positive experience with our team. Thank you for choosing us!"
        createdAt="5 hours ago"
        onApprove={(id) => console.log('Approved review:', id)}
        onEscalate={(id) => console.log('Escalated review:', id)}
      />
      
      <ReviewCard
        id="3"
        rating={2}
        content="Waited 3 hours for the tech to show up. Not happy with the 'emergency' response time."
        sourcePlatform="google"
        status="escalated"
        createdAt="1 day ago"
      />
    </div>
  );
}
