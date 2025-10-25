import StarRating from '../StarRating';

export default function StarRatingExample() {
  return (
    <div className="space-y-4 p-6">
      <StarRating rating={5} showNumber />
      <StarRating rating={4} showNumber />
      <StarRating rating={3} size="lg" showNumber />
      <StarRating rating={2.5} showNumber />
      <StarRating rating={1} size="sm" />
    </div>
  );
}
