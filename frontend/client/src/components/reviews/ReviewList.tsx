import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  food_rating: number;
  service_rating: number;
  ambiance_rating: number;
  value_rating: number;
  helpful_count: number;
  unhelpful_count: number;
  is_verified: boolean;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
  onMarkHelpful?: (reviewId: number) => void;
  onMarkUnhelpful?: (reviewId: number) => void;
}

export function ReviewList({ reviews, onMarkHelpful, onMarkUnhelpful }: ReviewListProps) {
  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma avaliacao ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                {review.is_verified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verificado
                  </span>
                )}
              </div>
              <h4 className="font-semibold mt-2">{review.title}</h4>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{review.comment}</p>

          <div className="grid grid-cols-4 gap-2 text-sm mb-3">
            <div>
              <span className="text-gray-500">Comida</span>
              <div className="flex gap-1">{renderStars(review.food_rating)}</div>
            </div>
            <div>
              <span className="text-gray-500">Atendimento</span>
              <div className="flex gap-1">{renderStars(review.service_rating)}</div>
            </div>
            <div>
              <span className="text-gray-500">Ambiente</span>
              <div className="flex gap-1">{renderStars(review.ambiance_rating)}</div>
            </div>
            <div>
              <span className="text-gray-500">Custo-beneficio</span>
              <div className="flex gap-1">{renderStars(review.value_rating)}</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {new Date(review.created_at).toLocaleDateString('pt-BR')}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkHelpful?.(review.id)}
                className="flex items-center gap-1"
              >
                <ThumbsUp size={16} />
                <span>{review.helpful_count}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkUnhelpful?.(review.id)}
                className="flex items-center gap-1"
              >
                <ThumbsDown size={16} />
                <span>{review.unhelpful_count}</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
