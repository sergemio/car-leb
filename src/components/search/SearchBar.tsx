'use client';

import { useState, useRef, useEffect } from 'react';
import { MAKE_NAMES, CAR_MAKES } from '@/lib/constants';

interface SearchBarProps {
  onSearch: (make: string, model: string) => void;
  initialMake?: string;
  initialModel?: string;
}

export function SearchBar({ onSearch, initialMake = '', initialModel = '' }: SearchBarProps) {
  const [query, setQuery] = useState(
    initialMake ? `${initialMake} ${initialModel}`.trim() : ''
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const matches: string[] = [];

    for (const make of MAKE_NAMES) {
      if (make.toLowerCase().includes(q)) {
        matches.push(make);
      }
      for (const model of CAR_MAKES[make]) {
        const full = `${make} ${model}`;
        if (full.toLowerCase().includes(q)) {
          matches.push(full);
        }
      }
      if (matches.length >= 8) break;
    }

    setSuggestions(matches.slice(0, 8));
  }, [query]);

  function handleSelect(value: string) {
    setQuery(value);
    setShowSuggestions(false);
    const make = MAKE_NAMES.find(m => value.startsWith(m)) || value.split(' ')[0];
    const model = value.replace(make, '').trim();
    onSearch(make, model);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      onSearch(query, '');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center gap-2 p-2 bg-white border-2 border-[var(--ink)] rounded-full shadow-[5px_5px_0_var(--ink)] max-w-full">
        <svg className="w-5 h-5 text-[var(--gray-4)] ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search BMW, Range Rover, Camry…"
          className="flex-1 bg-transparent outline-none text-[15px] text-[var(--ink)] placeholder:text-[var(--gray-3)] h-11 px-1"
        />
        <button
          type="submit"
          className="h-11 px-5 rounded-full bg-[var(--ink)] text-white font-mono text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white hover:text-[var(--ink)] border border-[var(--ink)] transition-colors shrink-0"
        >
          Search →
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-[var(--ink)] rounded-2xl overflow-hidden shadow-[5px_5px_0_var(--ink)]">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-5 py-3 hover:bg-[var(--gray-1)] text-[14px] text-[var(--ink)]"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
