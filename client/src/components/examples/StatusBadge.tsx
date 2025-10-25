import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3 p-6">
      <StatusBadge status="live" />
      <StatusBadge status="active" />
      <StatusBadge status="paused" />
      <StatusBadge status="draft" />
      <StatusBadge status="in_progress" />
      <StatusBadge status="new" />
      <StatusBadge status="replied" />
      <StatusBadge status="escalated" />
    </div>
  );
}
