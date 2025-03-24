import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`relative transition-all rounded-md ${isFocused ? 'ring-1 ring-red-500' : ''}`}>
      <Icon 
        icon="line-md:search-twotone" 
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 transition-colors ${
          isFocused ? 'text-red-500' : 'text-zinc-400'
        }`} 
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search movies..."
        className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-zinc-100 rounded-md border border-zinc-700 focus:outline-none focus:border-red-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
          aria-label="Clear Search"
        >
          <Icon icon="ph:x-circle" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}