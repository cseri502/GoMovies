import React, { useState } from 'react';
import { Movie, MovieFormData } from '../types/movie';
import { Icon } from '@iconify/react';

interface MovieFormProps {
  onSubmit: (data: MovieFormData, imageFile?: File, movieId?: number) => Promise<void>;
  onClose: () => void;
  initialData?: Movie;
  title: string;
}

export function MovieForm({ onSubmit, onClose, initialData, title }: MovieFormProps) {
  const [formData, setFormData] = useState<MovieFormData>({
    title: initialData?.title || '',
    year: initialData?.year || new Date().getFullYear(),
    director: initialData?.director || '',
    rating: initialData?.rating || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url ? `http://localhost:8080/${initialData.image_url}` : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData, imageFile || undefined, initialData?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(initialData?.image_url ? `http://localhost:8080/${initialData.image_url}` : null);
    }
  }

  return (
    <div className="fixed inset-0 bg-zinc-950/95 overflow-y-auto flex items-center justify-center p-4 z-50">
      <div 
        className="bg-zinc-800 rounded-md w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100"
          aria-label="Close"
        >
          <Icon icon="uil:times" className="text-2xl" />
        </button>

        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-5">{title}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image preview and upload */}
            <div className="mb-4">
              {imagePreview ? (
                <div className="relative mb-3 aspect-[16/9] bg-zinc-700 rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-zinc-800 bg-opacity-75 rounded-full hover:bg-opacity-100"
                    aria-label="Remove Image"
                  >
                    <Icon icon="uil:times" className="text-zinc-100" />
                  </button>
                </div>
              ) : (
                <div className="aspect-[16/9] bg-zinc-700 rounded-md mb-3 flex items-center justify-center">
                  <Icon icon="ion:image-outline" className="text-4xl text-zinc-500" />
                </div>
              )}
              
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md cursor-pointer transition-colors">
                <Icon icon="heroicons:photo" />
                <span>Select Movie Poster</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-700 rounded-md border border-zinc-600 text-zinc-100 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-700 rounded-md border border-zinc-600 text-zinc-100 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-zinc-700 rounded-md border border-zinc-600 text-zinc-100 focus:outline-none focus:border-red-500"
                min="1888"
                max={new Date().getFullYear() + 5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Rating
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full mr-2"
                />
                <span className="text-zinc-300 min-w-10 text-right">{formData.rating.toFixed(1)}</span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-300 hover:text-zinc-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}