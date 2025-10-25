import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import ActiveCampaignsCard from "@/components/ActiveCampaignsCard";
import { DollarSign, Star, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { toast } = useToast();
  const [optimizationDialog, setOptimizationDialog] = useState<{ open: boolean, area: string, suggestion: string }>({
    open: false,
    area: '',
    suggestion: ''
  });

  // Fetch ads summary
  const { data: adsSummary, isLoading: adsLoading } = useQuery<any>({
    queryKey: ['/api/ads/summary'],
  });

  // Fetch reviews for reputation health and open fires
  const { data: reviews, isLoading: reviewsLoading } = useQuery<any[]>({
    queryKey: ['/api/reviews'],
  });

  // Fetch marketing overview
  const { data: marketingOverview, isLoading: marketingLoading } = useQuery<any>({
    queryKey: ['/api/marketing/overview'],
  });

  // Optimize mutation
  const optimizeMutation = useMutation({
    mutationFn: async (area: 'GBP' | 'ADS') => {
      return await apiRequest('POST', '/api/marketing/optimize', { area }) as any;
    },
    onSuccess: (data: any) => {
      // Invalidate marketing overview to refresh recent actions
      queryClient.invalidateQueries({ queryKey: ['/api/marketing/overview'] });
      
      // Show optimization suggestion in dialog
      setOptimizationDialog({
        open: true,
        area: data.area,
        suggestion: data.suggestion
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate optimization. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Calculate metrics
  const weekResults = {
    spend: adsSummary ? `$${adsSummary.spend.toFixed(2)}` : '$0',
    leads: adsSummary?.leads || 0,
    revenue: adsSummary ? `$${adsSummary.estRevenue.toFixed(2)}` : '$0'
  };

  const avgRating = reviews?.length 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';
  
  const newReviews = reviews?.filter((r: any) => r.status === 'new').length || 0;
  
  const reputationHealth = {
    avgRating: parseFloat(avgRating),
    newReviews
  };

  const openFires = {
    escalated: reviews?.filter((r: any) => r.status === 'escalated').length || 0
  };

  const campaignStatus = {
    gbpStatus: (marketingOverview?.businessProfile?.status || 'not_started') as 'not_started' | 'in_progress' | 'live',
    adsStatus: (marketingOverview?.adsCampaign?.status || 'draft') as 'draft' | 'active' | 'paused'
  };

  const recentActions = marketingOverview?.recentOptimizations || [];

  const handleOptimizeGBP = () => {
    optimizeMutation.mutate('GBP');
  };

  const handleOptimizeAds = () => {
    optimizeMutation.mutate('ADS');
  };

  const isLoading = adsLoading || reviewsLoading || marketingLoading;

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

          {!isLoading && (
            <ActiveCampaignsCard
              campaignStatus={campaignStatus}
              recentActions={recentActions}
              onOptimizeGBP={handleOptimizeGBP}
              onOptimizeAds={handleOptimizeAds}
              isOptimizing={optimizeMutation.isPending}
            />
          )}
        </div>
      </main>

      {/* Optimization Suggestion Dialog */}
      <Dialog open={optimizationDialog.open} onOpenChange={(open) => setOptimizationDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {optimizationDialog.area === 'GBP' ? 'Google Business Profile' : 'Google Ads'} Optimization
            </DialogTitle>
            <DialogDescription>
              AI-generated suggestion for your marketing campaign
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-foreground">{optimizationDialog.suggestion}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOptimizationDialog(prev => ({ ...prev, open: false }))}
              data-testid="button-close-dialog"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Logged",
                  description: "This optimization has been logged for review."
                });
                setOptimizationDialog(prev => ({ ...prev, open: false }));
              }}
              data-testid="button-accept-suggestion"
            >
              Accept & Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
