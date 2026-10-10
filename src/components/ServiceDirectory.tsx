import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { ServiceResource, ServiceCategory, SFNeighborhood, Language, getLocalized } from '../types';
import { sfServices } from '../data/services';
import { translations } from '../data/translations';
import { ServiceDetailModal } from './ServiceDetailModal';

interface ServiceDirectoryProps {
  language: Language;
  savedItemIds: string[];
  onToggleSave: (id: string) => void;
  selectedCategoryFromParent?: ServiceCategory | null;
}

export const ServiceDirectory: React.FC<ServiceDirectoryProps> = ({
  language,
  savedItemIds,
  onToggleSave,
  selectedCategoryFromParent,
}) => {
  const t = translations[language] || translations.en;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>(
    selectedCategoryFromParent || 'all'
  );
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SFNeighborhood | 'all'>('all');
  const [filterWalkIn, setFilterWalkIn] = useState(false);
  const [filterRapidArt, setFilterRapidArt] = useState(false);
  const [filterSpanish, setFilterSpanish] = useState(false);

  // Modal inspection state
  const [activeModalService, setActiveModalService] = useState<ServiceResource | null>(null);

  const categoriesList: Array<{ id: ServiceCategory | 'all'; label: string }> = [
    { id: 'all', label: t.categories.all },
    { id: 'clinical', label: t.categories.clinical },
    { id: 'adap', label: t.categories.adap },
    { id: 'housing', label: t.categories.housing },
    { id: 'nutrition', label: t.categories.nutrition },
    { id: 'harm_reduction', label: t.categories.harm_reduction },
    { id: 'legal', label: t.categories.legal },
    { id: 'mental_health', label: t.categories.mental_health },
    { id: 'dental', label: t.categories.dental },
    { id: 'youth', label: t.categories.youth },
  ];

  const neighborhoodsList: Array<SFNeighborhood | 'all'> = [
    'all',
    'Castro',
    'Mission',
    'Tenderloin',
    'SoMa',
    'Potrero',
    'Bayview',
    'Western Addition',
    'Civic Center',
    'Citywide',
  ];

  // Filtered services
  const filteredServices = useMemo(() => {
    return sfServices.filter((service) => {
      if (selectedCategory !== 'all' && service.category !== selectedCategory) {
        return false;
      }
      if (selectedNeighborhood !== 'all' && service.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (filterWalkIn && !service.walkIn) {
        return false;
      }
      if (filterRapidArt && !service.rapidArtAvailable) {
        return false;
      }
      if (filterSpanish && !service.bilingualStaff) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesShort = getLocalized(service.shortDesc, language).toLowerCase().includes(query);
        const matchesAddress = service.address.toLowerCase().includes(query);
        const matchesNeighborhood = service.neighborhood.toLowerCase().includes(query);
        const matchesTags = service.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesName && !matchesShort && !matchesAddress && !matchesNeighborhood && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedNeighborhood, filterWalkIn, filterRapidArt, filterSpanish, language]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedNeighborhood('all');
    setFilterWalkIn(false);
    setFilterRapidArt(false);
    setFilterSpanish(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedNeighborhood !== 'all' ||
    filterWalkIn ||
    filterRapidArt ||
    filterSpanish;

  return (
    <div className="space-y-6 font-['Nunito_Sans']">
      {/* Directory Title Banner with CENTERED TEXT */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#001b2e] border-2 border-slate-300 dark:border-white/20 shadow-md text-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#002b49] text-white border-2 border-[#002b49] mb-3 mx-auto">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-white">ZSFGH Ward 86 & San Francisco Care Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white mb-2 text-center">
            {t.directory.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-black dark:text-white leading-relaxed text-center max-w-2xl mx-auto">
            {t.directory.subtitle}
          </p>
        </div>

        {/* Search Bar Input Centered */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-500 text-black dark:text-white placeholder:text-black font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-[#002b49] shadow-xs text-center sm:text-left"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-black hover:text-rose-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Neighborhood Selector */}
          <div className="sm:w-60">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value as SFNeighborhood | 'all')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-500 text-black dark:text-white text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#002b49] shadow-xs cursor-pointer text-center"
            >
              <option value="all">{t.neighborhoods.all}</option>
              {neighborhoodsList
                .filter((n) => n !== 'all')
                .map((n) => (
                  <option key={n} value={n}>
                    {t.neighborhoods[n as SFNeighborhood]}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Category Pills Slider Centered */}
        <div className="mt-5 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-[#002b49] text-white border-[#002b49] shadow-md'
                    : 'bg-white dark:bg-slate-800 text-black dark:text-white border-slate-300 dark:border-slate-600 hover:border-[#002b49]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Requirement Toggles Centered */}
        <div className="mt-5 pt-4 border-t-2 border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setFilterWalkIn(!filterWalkIn)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                filterWalkIn
                  ? 'bg-emerald-700 border-emerald-800 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white'
              }`}
            >
              <span>⚡</span>
              <span>{t.common.walkInAvailable}</span>
              {filterWalkIn && <Check className="w-3.5 h-3.5 text-white ml-0.5" />}
            </button>

            <button
              onClick={() => setFilterRapidArt(!filterRapidArt)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                filterRapidArt
                  ? 'bg-[#c41230] border-[#9b0e25] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white'
              }`}
            >
              <span>💊</span>
              <span>{t.common.rapidArt}</span>
              {filterRapidArt && <Check className="w-3.5 h-3.5 text-white ml-0.5" />}
            </button>

            <button
              onClick={() => setFilterSpanish(!filterSpanish)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                filterSpanish
                  ? 'bg-[#b45309] border-[#92400e] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white'
              }`}
            >
              <span>🗣️</span>
              <span>{t.common.bilingualStaff}</span>
              {filterSpanish && <Check className="w-3.5 h-3.5 text-white ml-0.5" />}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-black text-black underline hover:text-[#002b49] cursor-pointer ml-2"
            >
              {t.common.clearFilters}
            </button>
          )}
        </div>
      </div>

      {/* Results Count Centered */}
      <div className="flex items-center justify-center gap-4 text-xs font-black text-black dark:text-white text-center">
        <span>{t.directory.resultsCount.replace('{count}', String(filteredServices.length))}</span>
        {selectedNeighborhood !== 'all' && (
          <span className="px-3 py-1 rounded-full bg-slate-200 border border-slate-400 text-black font-black">
            📍 {t.neighborhoods[selectedNeighborhood]}
          </span>
        )}
      </div>

      {/* Services Grid with CENTERED TEXT in Card Headers */}
      {filteredServices.length === 0 ? (
        <div className="glass-surface p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-300 max-w-xl mx-auto">
          <Info className="w-10 h-10 text-black mx-auto mb-3" />
          <h3 className="text-lg font-black text-black dark:text-white mb-1 text-center">
            No Matching Services Found
          </h3>
          <p className="text-sm font-bold text-black dark:text-slate-300 max-w-md mx-auto mb-4 text-center">
            {t.directory.noResults}
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-[#002b49] text-white text-xs font-black hover:bg-[#001f35] shadow-sm cursor-pointer"
          >
            {t.common.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const isSaved = savedItemIds.includes(service.id);

            return (
              <div
                key={service.id}
                className="glass-surface glass-card flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#001b2e] border-2 border-slate-300 dark:border-white/20 shadow-md hover:shadow-xl transition-all text-center"
              >
                <div>
                  {/* Category & Badges Centered */}
                  <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#002b49] text-white border border-[#002b49]">
                      {t.categories[service.category]}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 border border-slate-400 text-black">
                      📍 {service.neighborhood}
                    </span>
                  </div>

                  {/* Title & Short Description Centered */}
                  <h3 className="text-lg font-black text-black dark:text-white mb-2 line-clamp-2 leading-tight text-center">
                    {service.name}
                  </h3>
                  <p className="text-xs font-bold text-black dark:text-white leading-relaxed mb-4 line-clamp-3 text-center">
                    {getLocalized(service.shortDesc, language)}
                  </p>

                  {/* High Contrast Badges Centered */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                    {service.walkIn && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-700 text-white border border-emerald-800">
                        ⚡ {t.directory.walkInBadge}
                      </span>
                    )}
                    {service.rapidArtAvailable && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-[#c41230] text-white border border-[#9b0e25]">
                        💊 {t.directory.rapidArtBadge}
                      </span>
                    )}
                    {service.bilingualStaff && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-[#b45309] text-white border border-[#92400e]">
                        🗣️ {t.directory.bilingualBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Hours, Phone & Actions */}
                <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-center gap-4 text-xs font-black text-black dark:text-white text-center">
                    <span className="flex items-center justify-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 text-[#002b49] shrink-0" />
                      <span className="truncate">{getLocalized(service.hours, language)}</span>
                    </span>
                    <a
                      href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center justify-center gap-1 font-black text-[#002b49] dark:text-teal-300 underline shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{service.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="flex-1 py-3 px-3 rounded-xl bg-[#002b49] hover:bg-[#001729] text-white text-xs font-black transition-all text-center cursor-pointer shadow-md"
                    >
                      {t.common.viewDetails}
                    </button>

                    <button
                      onClick={() => onToggleSave(service.id)}
                      title={isSaved ? t.common.inPlan : t.common.saveToPlan}
                      className={`p-3 rounded-xl transition-all cursor-pointer border-2 ${
                        isSaved
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-white text-black border-slate-400 hover:border-[#002b49]'
                      }`}
                      aria-label={isSaved ? t.common.inPlan : t.common.saveToPlan}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4 text-[#002b49]" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      {activeModalService && (
        <ServiceDetailModal
          service={activeModalService}
          onClose={() => setActiveModalService(null)}
          language={language}
          isSaved={savedItemIds.includes(activeModalService.id)}
          onToggleSave={onToggleSave}
        />
      )}
    </div>
  );
};
