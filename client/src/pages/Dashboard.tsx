import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import ActiveCampaignsCard from "@/components/ActiveCampaignsCard";
import { DollarSign, Star, AlertCircle } from "lucide-react";

export default function Dashboard() {
  // Mock data - todo: remove mock functionality
  const weekResults = {
    spend: "$417",
    leads: 12,
    revenue: "$2,050"
  };

  const reputationHealth = {
    avgRating: 4.8,
    newReviews: 5
  };

  const openFires = {
    escalated: 2
  };

  const campaignStatus = {
    gbpStatus: 'live' as const,
    adsStatus: 'active' as const
  };

  const recentActions = [
    {
      id: '1',
      timestamp: '2 hours ago',
      area: 'ADS' as const,
      actionSummary: "Paused keyword 'cheap furnace fix' after $47 spend and 0 calls",
      impactNote: "Cut waste, redirect budget to '24hr AC repair bellevue'"
    },
    {
      id: '2',
      timestamp: '1 day ago',
      area: 'GBP' as const,
      actionSummary: "Posted Fall Tune-Up 20% Off promo to Google Business Profile",
      impactNote: "Drives seasonal maintenance bookings"
    },
    {
      id: '3',
      timestamp: '3 days ago',
      area: 'ADS' as const,
      actionSummary: "Raised bid on '24hr AC repair bellevue' to $2.60",
      impactNote: "Expected +15% call volume after 6pm"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2" data-testid="text-page-title">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Monitor your marketing performance and AI optimizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="This Week's Results"
              value={weekResults.spend}
              subtitle={`${weekResults.leads} leads • ${weekResults.revenue} est. revenue`}
              icon={DollarSign}
              trend={{ value: "8% vs last week", isPositive: true }}
            />
            
            <MetricCard
              title="Reputation Health"
              value={reputationHealth.avgRating}
              subtitle={`${reputationHealth.newReviews} new reviews awaiting response`}
              icon={Star}
            />
            
            <MetricCard
              title="Open Fires"
              value={openFires.escalated}
              subtitle="Escalated reviews needing attention"
              icon={AlertCircle}
            />
          </div>

          <ActiveCampaignsCard
            campaignStatus={campaignStatus}
            recentActions={recentActions}
            onOptimizeGBP={() => console.log('Optimize GBP')}
            onOptimizeAds={() => console.log('Optimize Ads')}
          />
        </div>
      </main>
    </div>
  );
}
