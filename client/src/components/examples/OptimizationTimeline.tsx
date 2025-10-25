import OptimizationTimeline from '../OptimizationTimeline';

export default function OptimizationTimelineExample() {
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
    <div className="p-6 max-w-2xl">
      <OptimizationTimeline actions={mockActions} />
    </div>
  );
}
