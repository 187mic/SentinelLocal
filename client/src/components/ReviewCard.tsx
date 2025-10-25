import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import StatusBadge from "./StatusBadge";

interface ReviewCardProps {
  id: string;
  rating: number;
  content: string;
  sourcePlatform: string;
  status: 'new' | 'replied' | 'escalated';
  aiSuggestedReply?: string;
  createdAt: string;
  onApprove?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

export default function ReviewCard({
  id,
  rating,
  content,
  sourcePlatform,
  status,
  aiSuggestedReply,
  createdAt,
  onApprove,
  onEscalate
}: ReviewCardProps) {
  return (
    <Card className="p-6" data-testid={`card-review-${id}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StarRating rating={rating} />
              <span className="text-xs text-muted-foreground capitalize">{sourcePlatform}</span>
              <StatusBadge status={status} />
            </div>
            <div className="text-xs text-muted-foreground">{createdAt}</div>
          </div>
        </div>

        <div className="text-sm text-foreground" data-testid="text-review-content">
          {content}
        </div>

        {aiSuggestedReply && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Suggested Reply
            </label>
            <Textarea
              value={aiSuggestedReply}
              readOnly
              className="resize-none text-sm"
              rows={3}
              data-testid="textarea-ai-reply"
            />
          </div>
        )}

        {status === 'new' && (
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onApprove?.(id)}
              data-testid="button-approve"
              className="flex-1"
            >
              Approve Reply
            </Button>
            <Button
              variant="outline"
              onClick={() => onEscalate?.(id)}
              data-testid="button-escalate"
            >
              Escalate
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
