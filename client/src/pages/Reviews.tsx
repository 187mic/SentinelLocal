import { useState } from "react";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/ReviewCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Reviews() {
  // Mock data - todo: remove mock functionality
  const [reviews, setReviews] = useState([
    {
      id: '1',
      rating: 5,
      content: "Amazing service! They came out at 11pm when our furnace died. Fixed it in 30 minutes. Will definitely call again!",
      sourcePlatform: 'google',
      status: 'new' as const,
      aiSuggestedReply: "Thank you so much for the kind words! We're always here 24/7 for emergencies. It was our pleasure to help get your heat back on quickly. We appreciate your business!",
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      rating: 4,
      content: "Good work but a bit pricey for what was done. Tech was professional though.",
      sourcePlatform: 'google',
      status: 'new' as const,
      aiSuggestedReply: "We appreciate your feedback! Our pricing reflects our 24/7 availability and certified technicians. We're glad you had a positive experience with our team. Thank you for choosing us!",
      createdAt: '5 hours ago'
    },
    {
      id: '3',
      rating: 2,
      content: "Waited 3 hours for the tech to show up. Not happy with the 'emergency' response time.",
      sourcePlatform: 'google',
      status: 'escalated' as const,
      createdAt: '1 day ago'
    },
    {
      id: '4',
      rating: 5,
      content: "Best HVAC company in Tacoma! Always reliable and fair pricing.",
      sourcePlatform: 'google',
      status: 'replied' as const,
      aiSuggestedReply: "Thank you for your continued trust!",
      createdAt: '2 days ago'
    }
  ]);

  const handleApprove = (id: string) => {
    console.log('Approved review:', id);
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'replied' as const } : r) as typeof reviews);
  };

  const handleEscalate = (id: string) => {
    console.log('Escalated review:', id);
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'escalated' as const } : r) as typeof reviews);
  };

  const filterReviews = (status?: string) => {
    if (!status) return reviews;
    return reviews.filter(r => r.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2" data-testid="text-page-title">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              Manage customer reviews and AI-suggested responses
            </p>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                All ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="new" data-testid="tab-new">
                New ({filterReviews('new').length})
              </TabsTrigger>
              <TabsTrigger value="escalated" data-testid="tab-escalated">
                Escalated ({filterReviews('escalated').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onApprove={handleApprove}
                  onEscalate={handleEscalate}
                />
              ))}
            </TabsContent>

            <TabsContent value="new" className="space-y-4 mt-6">
              {filterReviews('new').map(review => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onApprove={handleApprove}
                  onEscalate={handleEscalate}
                />
              ))}
            </TabsContent>

            <TabsContent value="escalated" className="space-y-4 mt-6">
              {filterReviews('escalated').map(review => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onApprove={handleApprove}
                  onEscalate={handleEscalate}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
