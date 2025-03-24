import { Icon } from "@iconify/react";
import { useState } from "react";
import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onRate: (id: number, rating: number) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

export function MovieCard({ movie, onRate, onEdit, onDelete }: MovieCardProps) {
  const [isRating, setIsRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const placeholderImage =
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80";

  const handleRateClick = (star: number) => {
    setIsRating(false);
    const apiRating = star * 2;
    onRate(movie.id, apiRating);
  };
  
  const hasHalfStar = ((movie.rating || 0) / 2) % 1 >= 0.25 && ((movie.rating || 0) / 2) % 1 < 0.75;
  const fullStarCount = Math.floor((movie.rating || 0) / 2);

  return (
    <div className="bg-zinc-800 rounded-md overflow-hidden shadow-lg transition-transform hover:scale-102 h-full flex flex-col">
      <div className="aspect-[16/9] relative group">
        <img
          src={
            movie.image_url
              ? `http://localhost:8080/${movie.image_url}`
              : placeholderImage
          }
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
        <div className="absolute inset-0 bg-zinc-950/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(movie)}
            className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
            aria-label="Edit"
          >
            <Icon icon="lucide:edit" className="text-zinc-100 text-xl" />
          </button>
          <button
            onClick={() => onDelete(movie.id)}
            className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
            aria-label="Delete"
          >
            <Icon icon="iconoir:trash-solid" className="text-red-500 text-xl" />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-1 line-clamp-1">{movie.title}</h3>
          <p className="text-zinc-400 text-sm mb-2">
            {movie.director} • {movie.year}
          </p>
        </div>

        <div className="mt-2">
          {isRating ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRateClick(star)}
                    className={`p-1 transition-transform ${
                      hoverRating >= star ? "text-red-500 scale-110" : "text-zinc-500"
                    }`}
                    aria-label={`Rate ${star}`}
                  >
                    <Icon icon="material-symbols:star" className="text-xl" />
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsRating(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 self-end"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starNumber = index + 1;
                  let iconName = "material-symbols:star";
                  let colorClass = "text-zinc-600";
                  
                  if (starNumber <= fullStarCount) {
                    colorClass = "text-red-500"; // Full star
                  } else if (starNumber === fullStarCount + 1 && hasHalfStar) {
                    iconName = "material-symbols:star-half";
                    colorClass = "text-red-500"; // Half star
                  }
                  
                  return (
                    <span key={index} className={`inline-block ${colorClass}`}>
                      <Icon icon={iconName} className="text-lg" />
                    </span>
                  );
                })}
                {movie.rating > 0 && (
                  <span className="text-xs text-zinc-400 ml-1">
                    {movie.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsRating(true)}
                className="ml-2 text-xs text-zinc-400 hover:text-red-400 transition-colors"
              >
                Rate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}