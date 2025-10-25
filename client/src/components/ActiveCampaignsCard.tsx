import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import OptimizationTimeline from "./OptimizationTimeline";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface CampaignStatus {
  gbpStatus: 'live' | 'in_progress' | 'not_started';
  adsStatus: 'active' | 'paused' | 'draft';
}

interface OptimizationAction {
  id: string;
  timestamp: string;
  area: 'GBP' | 'ADS';
  actionSummary: string;
  impactNote?: string;
}

interface ActiveCampaignsCardProps {
  campaignStatus: CampaignStatus;
  recentActions: OptimizationAction[];
  onOptimizeGBP?: () => void;
  onOptimizeAds?: () => void;
}

export default function ActiveCampaignsCard({
  campaignStatus,
  recentActions,
  onOptimizeGBP,
  onOptimizeAds
}: ActiveCampaignsCardProps) {
  const [gbpSuggestion, setGbpSuggestion] = useState<string | null>(null);
  const [adsSuggestion, setAdsSuggestion] = useState<string | null>(null);
  const [isOptimizingGBP, setIsOptimizingGBP] = useState(false);
  const [isOptimizingAds, setIsOptimizingAds] = useState(false);

  const handleOptimizeGBP = async () => {
    setIsOptimizingGBP(true);
    onOptimizeGBP?.();
    // Mock AI suggestion
    setTimeout(() => {
      setGbpSuggestion("Proposed GBP Post: 'Winter Furnace Check - 20% Off This Week Only. Call Now, We're Local!'");
      setIsOptimizingGBP(false);
    }, 1500);
  };

  const handleOptimizeAds = async () => {
    setIsOptimizingAds(true);
    onOptimizeAds?.();
    // Mock AI suggestion
    setTimeout(() => {
      setAdsSuggestion("Ads Optimization: Pause 'cheap furnace fix', raise bid on '24hr AC repair bellevue' by $0.50 after 6pm.");
      setIsOptimizingAds(false);
    }, 1500);
  };

  return (
    <Card className="p-8" data-testid="card-active-campaigns">
      <h2 className="text-lg font-medium mb-6">Active Campaigns</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Google Business Profile</span>
              <StatusBadge status={campaignStatus.gbpStatus} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Google Ads Campaign</span>
              <StatusBadge status={campaignStatus.adsStatus} />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleOptimizeGBP}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={isOptimizingGBP}
              data-testid="button-optimize-gbp"
            >
              <Sparkles className="w-4 h-4" />
              {isOptimizingGBP ? 'Optimizing...' : 'Optimize Google Profile'}
            </Button>
            
            {gbpSuggestion && (
              <div className="text-sm bg-green-50 text-green-900 p-3 rounded-lg border border-green-200" data-testid="text-gbp-suggestion">
                {gbpSuggestion}
              </div>
            )}

            <Button
              onClick={handleOptimizeAds}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={isOptimizingAds}
              data-testid="button-optimize-ads"
            >
              <Sparkles className="w-4 h-4" />
              {isOptimizingAds ? 'Optimizing...' : 'Optimize Ads Budget'}
            </Button>
            
            {adsSuggestion && (
              <div className="text-sm bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200" data-testid="text-ads-suggestion">
                {adsSuggestion}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Optimizations
          </h3>
          <OptimizationTimeline actions={recentActions} />
        </div>
      </div>
    </Card>
  );
}
