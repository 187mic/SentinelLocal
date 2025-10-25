import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import OptimizationTimeline from "./OptimizationTimeline";
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
  isOptimizing?: boolean;
}

export default function ActiveCampaignsCard({
  campaignStatus,
  recentActions,
  onOptimizeGBP,
  onOptimizeAds,
  isOptimizing = false
}: ActiveCampaignsCardProps) {
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
              onClick={onOptimizeGBP}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={isOptimizing}
              data-testid="button-optimize-gbp"
            >
              <Sparkles className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Google Profile'}
            </Button>

            <Button
              onClick={onOptimizeAds}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={isOptimizing}
              data-testid="button-optimize-ads"
            >
              <Sparkles className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Ads Budget'}
            </Button>
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
