'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search wrestlers...',
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    // Real-time search as user types
    if (newQuery.trim().length >= 2 || newQuery.trim().length === 0) {
      onSearch(newQuery.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 bg-gray-900 border-2 text-white placeholder-gray-500 rounded-xl font-semibold text-lg focus:outline-none transition-all duration-300 ${
            isFocused
              ? 'border-yellow-500 shadow-lg shadow-yellow-500/20 bg-black'
              : 'border-gray-800 hover:border-gray-700'
          }`}
          aria-label="Search wrestlers"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors bg-gray-800 hover:bg-red-900/30 rounded-full p-1 w-7 h-7 flex items-center justify-center font-bold"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {/* Animated border glow */}
        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-red-500/20 to-yellow-500/20 blur-xl"></div>
        </div>
      </div>
    </form>
  )
}
