import { Icon } from "@iconify/react";
import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onRate: (id: number, rating: number) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const placeholderImage =
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80";

  const normalizedRating = movie.rating / 2;

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
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-zinc-400 text-sm mb-2">
            {movie.director} • {movie.year}
          </p>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                let starType = "material-symbols:star-outline";
                let starColor = "text-zinc-600";

                if (starValue <= Math.floor(normalizedRating)) {
                  // Fully filled star
                  starType = "material-symbols:star";
                  starColor = "text-yellow-500";
                } else if (
                  starValue === Math.ceil(normalizedRating) &&
                  normalizedRating % 1 >= 0.25
                ) {
                  // Partially filled star
                  starType = "material-symbols:star-half";
                  starColor = "text-yellow-500";
                }

                return (
                  <Icon
                    key={index}
                    icon={starType}
                    className={`text-lg ${starColor}`}
                  />
                );
              })}
              {movie.rating > 0 && (
                <span className="text-xs text-zinc-400 ml-2">
                  {movie.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}