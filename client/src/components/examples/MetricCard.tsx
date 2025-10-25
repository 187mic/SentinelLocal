import MetricCard from '../MetricCard';
import { DollarSign } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <MetricCard
        title="This Week's Spend"
        value="$417"
        subtitle="12 leads generated"
        icon={DollarSign}
        trend={{ value: "8% vs last week", isPositive: true }}
      />
      <MetricCard
        title="Reputation Health"
        value="4.8"
        subtitle="24 reviews this month"
      />
      <MetricCard
        title="Open Fires"
        value="2"
        subtitle="Escalated reviews"
        trend={{ value: "1 new today", isPositive: false }}
      />
    </div>
  );
}
