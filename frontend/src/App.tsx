import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Movie, MovieFormData } from './types/movie';
import { getAllMovies, createMovie, updateMovie, deleteMovie, uploadMovieImage, rateMovie } from './api/movies';
import { MovieCard } from './components/MovieCard';
import { SearchBar } from './components/SearchBar';
import { MovieForm } from './components/MovieForm';

type SortOption = 'title' | 'year' | 'rating';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const data = await getAllMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMovie(data: MovieFormData, imageFile?: File) {
    try {
      const newMovie = await createMovie(data);
      
      if (imageFile) {
        await uploadMovieImage(newMovie.id, imageFile);
      }
      
      await fetchMovies();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function handleUpdateMovie(data: MovieFormData, imageFile?: File, movieId?: number) {
    if (!movieId) {
      return Promise.reject(new Error("Movie ID is missing"));
    }
    
    try {
      await updateMovie(movieId, data);
      
      if (imageFile) {
        await uploadMovieImage(movieId, imageFile);
      }
      
      await fetchMovies();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function handleDeleteMovie(id: number) {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        await fetchMovies();
      } catch (error) {
        setError('Failed to delete the movie');
      }
    }
  }

  async function handleRate(movieId: number, rating: number) {
    try {
      const updatedMovie = await rateMovie(movieId, rating);
      
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === movieId ? { ...movie, rating: updatedMovie.rating } : movie
        )
      );
    } catch (error) {
      console.error("Rating error:", error);
    }
  }

  function handleEdit(movie: Movie) {
    setEditingMovie(movie);
    setShowForm(true);
  }

  function handleSortChange(option: SortOption) {
    if (sortBy === option) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  }

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'year') {
      return sortDirection === 'asc'
        ? a.year - b.year
        : b.year - a.year;
    } else { 
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return sortDirection === 'asc'
        ? ratingA - ratingB
        : ratingB - ratingA;
    }
  });

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function getSortIcon(option: SortOption) {
    if (sortBy !== option) {
      return "heroicons:bars-arrow-up";
    }
    return sortDirection === 'asc' 
      ? "heroicons:arrow-up" 
      : "heroicons:arrow-down";
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-800 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/movie.png" alt="GoMovies" className="w-8 sm:w-10" draggable="false" />
              <h1 className="text-xl sm:text-2xl font-bold">GoMovies</h1>
            </div>
            
            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-4">
              <div className="w-64 lg:w-96">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={() => {
                  setEditingMovie(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                <Icon icon="gravity-ui:plus" />
                <span>New Movie</span>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={toggleMenu}
                className="p-2 text-zinc-100 hover:text-red-500"
              >
                <Icon icon={isMenuOpen ? "heroicons:x-mark" : "heroicons:bars-3"} className="text-2xl" />
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden">
              <div className="mb-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={() => {
                  setEditingMovie(null);
                  setShowForm(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                <Icon icon="gravity-ui:plus" />
                <span>New Movie</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Sorting Controls */}
        {!loading && !error && filteredMovies.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <span className="text-zinc-400">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSortChange('title')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                    sortBy === 'title' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span>Title</span>
                  <Icon icon={getSortIcon('title')} className="text-sm" />
                </button>
                <button 
                  onClick={() => handleSortChange('year')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                    sortBy === 'year' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span>Year</span>
                  <Icon icon={getSortIcon('year')} className="text-sm" />
                </button>
                <button 
                  onClick={() => handleSortChange('rating')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                    sortBy === 'rating' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span>Rating</span>
                  <Icon icon={getSortIcon('rating')} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchMovies}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        ) : sortedMovies.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Icon icon="ion:film-outline" className="mx-auto text-6xl text-zinc-700" />
            <p className="mt-4 text-zinc-500 text-lg">
              {searchQuery ? 'No movies found matching your search.' : 'No movies available.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRate={handleRate}
                onEdit={handleEdit}
                onDelete={handleDeleteMovie}
              />
            ))}
          </div>
        )}
      </main>

      {/* Movie form modal */}
      {showForm && (
        <MovieForm
          onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}
          onClose={() => {
            setShowForm(false);
            setEditingMovie(null);
          }}
          initialData={editingMovie || undefined}
          title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
        />
      )}
    </div>
  );
}

export default App;