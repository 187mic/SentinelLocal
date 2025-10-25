import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'live' | 'active' | 'paused' | 'draft' | 'not_started' | 'in_progress' | 'new' | 'replied' | 'escalated';
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'live':
      case 'active':
        return {
          className: 'bg-green-50 text-green-700 border-green-200',
          text: label || status.charAt(0).toUpperCase() + status.slice(1)
        };
      case 'paused':
      case 'draft':
      case 'in_progress':
        return {
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          text: label || status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)
        };
      case 'escalated':
        return {
          className: 'bg-red-50 text-red-700 border-red-200',
          text: label || 'Escalated'
        };
      case 'new':
      case 'not_started':
        return {
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          text: label || (status === 'not_started' ? 'Not Started' : 'New')
        };
      case 'replied':
        return {
          className: 'bg-gray-50 text-gray-700 border-gray-200',
          text: label || 'Replied'
        };
      default:
        return {
          className: 'bg-gray-50 text-gray-700 border-gray-200',
          text: label || status
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} px-3 py-1 text-xs font-semibold`}
      data-testid={`badge-status-${status}`}
    >
      {config.text}
    </Badge>
  );
}
