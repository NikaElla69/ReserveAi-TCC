import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  comment: z.string().min(10).max(1000),
  food_rating: z.number().min(1).max(5),
  service_rating: z.number().min(1).max(5),
  ambiance_rating: z.number().min(1).max(5),
  value_rating: z.number().min(1).max(5)
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  restaurantName: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ReviewForm({ restaurantName, onSubmit, isLoading }: ReviewFormProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      food_rating: 0,
      service_rating: 0,
      ambiance_rating: 0,
      value_rating: 0
    }
  });

  const handleRatingChange = (type: string, value: number) => {
    switch (type) {
      case 'overall':
        setOverallRating(value);
        setValue('rating', value);
        break;
      case 'food':
        setFoodRating(value);
        setValue('food_rating', value);
        break;
      case 'service':
        setServiceRating(value);
        setValue('service_rating', value);
        break;
      case 'ambiance':
        setAmbianceRating(value);
        setValue('ambiance_rating', value);
        break;
      case 'value':
        setValueRating(value);
        setValue('value_rating', value);
        break;
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-colors"
            type="button"
          >
            <Star
              size={24}
              className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Avaliando: {restaurantName}</h3>
        <p className="text-sm text-gray-600">Sua avaliação ajuda outros usuários</p>
      </div>

      <StarRating
        value={overallRating}
        onChange={(v) => handleRatingChange('overall', v)}
        label="Avaliacao Geral"
      />
      {errors.rating && <p className="text-red-500 text-sm">{String(errors.rating.message)}</p>}

      <div className="grid grid-cols-2 gap-4">
        <StarRating
          value={foodRating}
          onChange={(v) => handleRatingChange('food', v)}
          label="Comida"
        />
        <StarRating
          value={serviceRating}
          onChange={(v) => handleRatingChange('service', v)}
          label="Atendimento"
        />
        <StarRating
          value={ambianceRating}
          onChange={(v) => handleRatingChange('ambiance', v)}
          label="Ambiente"
        />
        <StarRating
          value={valueRating}
          onChange={(v) => handleRatingChange('value', v)}
          label="Custo-beneficio"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Titulo da Avaliacao</label>
        <Input
          placeholder="Ex: Excelente experiencia!"
          {...register('title')}
        />
        {errors.title && <p className="text-red-500 text-sm">{String(errors.title.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Seu Comentario</label>
        <textarea
          placeholder="Compartilhe sua experiencia..."
          rows={5}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setValue('comment', e.target.value);
          }}
          className="w-full p-2 border rounded-lg"
        />
        {errors.comment && <p className="text-red-500 text-sm">{String(errors.comment.message)}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Enviando...' : 'Enviar Avaliacao'}
      </Button>
    </form>
  );
}
