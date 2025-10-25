import ActiveCampaignsCard from '../ActiveCampaignsCard';

export default function ActiveCampaignsCardExample() {
  const mockActions = [
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
    }
  ];

  return (
    <div className="p-6">
      <ActiveCampaignsCard
        campaignStatus={{
          gbpStatus: 'live',
          adsStatus: 'active'
        }}
        recentActions={mockActions}
        onOptimizeGBP={() => console.log('Optimize GBP clicked')}
        onOptimizeAds={() => console.log('Optimize Ads clicked')}
      />
    </div>
  );
}
