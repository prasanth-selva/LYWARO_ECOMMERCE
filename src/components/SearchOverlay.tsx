import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { searchProducts } from '../services/productService';
import { popularSearches, recentSearches } from '../data/products';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import ProductVisual from './ProductVisual';

export default function SearchOverlay() {
  const { isOpen, closeSearch, query, setQuery } = useSearch();
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      searchProducts(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.05 }}
            className="max-w-2xl mx-auto pt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-lywaro-gray" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, styles, collections..."
                className="w-full bg-lywaro-charcoal border border-white/10 text-white pl-12 pr-12 py-4 text-sm font-medium tracking-wide placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors"
                aria-label="Search"
              />
              <button
                onClick={closeSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lywaro-gray hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              {query.length >= 2 ? (
                results.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-[0.2em] text-lywaro-gray mb-4 px-1">
                      {results.length} RESULTS
                    </p>
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-16 h-16 bg-lywaro-charcoal relative overflow-hidden flex-shrink-0">
                          <ProductVisual
                            slug={product.slug}
                            name={product.name}
                            category={product.category}
                            accentColor={product.colors[0]?.hex || '#D50000'}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-lywaro-crimson transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-lywaro-gray mt-0.5">{product.category} • {product.colors[0]?.name}</p>
                        </div>
                        <span className="text-sm font-bold text-white">{formatPrice(product.price)}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg font-bold tracking-wider text-white/30">NO RESULTS FOUND</p>
                    <p className="text-sm text-lywaro-gray/50 mt-2">Try a different search term</p>
                  </div>
                )
              ) : (
                <div className="space-y-8">
                  {/* Recent */}
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lywaro-gray mb-4">
                      <Clock size={12} />
                      RECENT SEARCHES
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 text-xs font-semibold tracking-wider border border-white/10 text-lywaro-gray hover:border-white/30 hover:text-white transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular */}
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lywaro-gray mb-4">
                      <TrendingUp size={12} />
                      POPULAR SEARCHES
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 text-xs font-semibold tracking-wider border border-white/10 text-lywaro-gray hover:border-lywaro-crimson/50 hover:text-lywaro-crimson transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
