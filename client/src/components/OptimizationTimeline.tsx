import { Card } from "@/components/ui/card";

interface OptimizationAction {
  id: string;
  timestamp: string;
  area: 'GBP' | 'ADS';
  actionSummary: string;
  impactNote?: string;
}

interface OptimizationTimelineProps {
  actions: OptimizationAction[];
}

export default function OptimizationTimeline({ actions }: OptimizationTimelineProps) {
  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <div key={action.id} className="flex gap-4" data-testid={`timeline-item-${index}`}>
          <div className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full ${
              action.area === 'ADS' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            {index < actions.length - 1 && (
              <div className="w-0.5 flex-1 bg-border mt-2" />
            )}
          </div>
          
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  action.area === 'ADS' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {action.area}
                </span>
                <span className="text-xs text-muted-foreground">
                  {action.timestamp}
                </span>
              </div>
            </div>
            
            <div className="text-sm font-medium text-foreground mb-1" data-testid={`text-action-${index}`}>
              {action.actionSummary}
            </div>
            
            {action.impactNote && (
              <div className="text-sm text-muted-foreground" data-testid={`text-impact-${index}`}>
                {action.impactNote}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
