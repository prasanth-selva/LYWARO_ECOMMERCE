import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';
import { SortOption } from '../types';

const allCategories = ['Running', 'Training', 'Lifestyle'];
const allGenders = ['Men', 'Women', 'Unisex'];
const allSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'FEATURED' },
  { value: 'newest', label: 'NEWEST' },
  { value: 'best-selling', label: 'BEST SELLING' },
  { value: 'price-low', label: 'PRICE LOW → HIGH' },
  { value: 'price-high', label: 'PRICE HIGH → LOW' },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.get('gender') ? [searchParams.get('gender')!] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategories([cat]);
    const gen = searchParams.get('gender');
    if (gen) setSelectedGenders([gen]);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    switch (sortBy) {
      case 'newest': result.reverse(); break;
      case 'best-selling': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [selectedCategories, selectedGenders, selectedSizes, sortBy]);

  const toggleFilter = <T extends string | number>(arr: T[], setArr: (v: T[]) => void, val: T) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const activeCount = selectedCategories.length + selectedGenders.length + selectedSizes.length;

  return (
    <div className="min-h-screen pt-16 lg:pt-24 pb-20">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">ALL PRODUCTS</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-white">SHOP ALL</h1>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between py-3 md:py-4 border-y border-white/5 mb-6 md:mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-lywaro-gray hover:text-white transition-colors"
          >
            <SlidersHorizontal size={14} />
            FILTERS
            {activeCount > 0 && (
              <span className="ml-1 w-5 h-5 bg-lywaro-crimson text-white rounded-full flex items-center justify-center text-[10px]">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-xs text-lywaro-gray">{filtered.length} PRODUCTS</span>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent border border-white/10 text-[10px] md:text-xs font-bold tracking-wider text-lywaro-gray pl-3 pr-8 py-2 hover:border-white/30 focus:outline-none focus:border-lywaro-crimson/50 transition-colors cursor-pointer"
                aria-label="Sort products"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-lywaro-dark text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-lywaro-gray pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter pills (mobile) */}
        {activeCount > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none md:hidden">
            {selectedCategories.map(c => (
              <button key={c} onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}
                className="flex items-center gap-1 px-3 py-1.5 bg-lywaro-crimson/10 border border-lywaro-crimson/30 text-[10px] font-bold tracking-wider text-lywaro-crimson flex-shrink-0">
                {c} <X size={10} />
              </button>
            ))}
            {selectedGenders.map(g => (
              <button key={g} onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}
                className="flex items-center gap-1 px-3 py-1.5 bg-lywaro-crimson/10 border border-lywaro-crimson/30 text-[10px] font-bold tracking-wider text-lywaro-crimson flex-shrink-0">
                {g} <X size={10} />
              </button>
            ))}
            {selectedSizes.map(s => (
              <button key={s} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                className="flex items-center gap-1 px-3 py-1.5 bg-lywaro-crimson/10 border border-lywaro-crimson/30 text-[10px] font-bold tracking-wider text-lywaro-crimson flex-shrink-0">
                {s} <X size={10} />
              </button>
            ))}
          </div>
        )}

        {/* Filters Panel — inline on desktop, bottom sheet on mobile */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Mobile overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 z-40 bg-black/60"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="md:relative md:opacity-100 md:translate-y-0 md:transition-none
                  fixed bottom-0 left-0 right-0 z-50 bg-lywaro-dark md:bg-transparent
                  max-h-[70vh] md:max-h-none overflow-y-auto md:overflow-visible
                  border-t border-white/10 md:border-0 rounded-t-xl md:rounded-none
                "
              >
                {/* Mobile drag handle */}
                <div className="md:hidden flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                <div className="p-5 md:p-0 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 pb-6 md:pb-8 md:border-b md:border-white/5">
                  {/* Category */}
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-white mb-3">CATEGORY</h4>
                    <div className="space-y-2.5">
                      {allCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                          className={`block text-xs tracking-wider transition-colors ${
                            selectedCategories.includes(cat) ? 'text-lywaro-crimson font-bold' : 'text-lywaro-gray hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-white mb-3">GENDER</h4>
                    <div className="space-y-2.5">
                      {allGenders.map(g => (
                        <button
                          key={g}
                          onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}
                          className={`block text-xs tracking-wider transition-colors ${
                            selectedGenders.includes(g) ? 'text-lywaro-crimson font-bold' : 'text-lywaro-gray hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="col-span-2">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-white mb-3">SIZE</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                          className={`min-w-[40px] h-9 text-[10px] font-bold border transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-lywaro-crimson text-lywaro-crimson bg-lywaro-crimson/10'
                              : 'border-white/10 text-lywaro-gray hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear + Apply (mobile) */}
                  <div className="col-span-2 flex items-center justify-between pt-2 border-t border-white/5">
                    {activeCount > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedCategories([]);
                          setSelectedGenders([]);
                          setSelectedSizes([]);
                        }}
                        className="flex items-center gap-2 text-xs font-bold tracking-wider text-lywaro-gray hover:text-lywaro-crimson transition-colors"
                      >
                        <X size={12} />
                        CLEAR ALL
                      </button>
                    ) : <div />}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="md:hidden bg-white text-black px-6 py-2.5 text-xs font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-colors"
                    >
                      SHOW {filtered.length} RESULTS
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} columns={4} />
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-bold tracking-wider text-white/30">NO PRODUCTS FOUND</p>
            <p className="text-sm text-lywaro-gray/50 mt-2">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedGenders([]);
                setSelectedSizes([]);
              }}
              className="mt-6 px-6 py-3 border border-white/20 text-xs font-bold tracking-wider text-lywaro-gray hover:border-white/50 hover:text-white transition-colors"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
