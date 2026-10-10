import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Loader2,
  HelpCircle,
  CheckCircle,
  Globe,
  Send,
} from 'lucide-react';
import { Language, SearchGroundingResponse } from '../types';
import { translations } from '../data/translations';

interface LiveSearchGroundingProps {
  language: Language;
}

export const LiveSearchGrounding: React.FC<LiveSearchGroundingProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchGroundingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quickQuestions = [
    t.searchGrounding.q1,
    t.searchGrounding.q2,
    t.searchGrounding.q3,
    t.searchGrounding.q4,
  ];

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          language,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const data: SearchGroundingResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(
        'Unable to verify live information at this moment. You can contact Ward 86 Triage directly at (628) 206-2400.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="space-y-6 font-['Nunito_Sans']">
      {/* Banner with CENTERED TEXT */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#001b2e]/80 border-2 border-white/80 dark:border-white/10 shadow-sm text-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#007c8a]/15 text-[#002b49] dark:bg-[#007c8a]/30 dark:text-teal-200 border border-[#007c8a]/30 mb-3 mx-auto">
            <Sparkles className="w-4 h-4 text-[#e28f1b]" />
            <span>Google Search Grounding via Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white mb-2 text-center">
            {t.searchGrounding.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-black dark:text-slate-200 leading-relaxed text-center max-w-2xl mx-auto">
            {t.searchGrounding.subtitle}
          </p>
        </div>

        {/* Search Input Box Centered */}
        <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-black" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchGrounding.placeholder}
              disabled={loading}
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#007c8a]/30 text-black dark:text-white placeholder:text-black/60 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#007c8a] shadow-xs text-center sm:text-left disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 px-4 py-2.5 rounded-xl bg-[#002b49] hover:bg-[#001f35] active:scale-95 disabled:opacity-50 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="hidden sm:inline text-white">Verifying...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">{t.searchGrounding.askButton}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Questions Buttons with Centered Title */}
        <div className="mt-6 max-w-2xl mx-auto text-center">
          <p className="text-xs font-black text-black dark:text-white mb-3 flex items-center justify-center gap-1.5 text-center">
            <HelpCircle className="w-4 h-4 text-[#007c8a]" />
            <span>{t.searchGrounding.quickQuestionsTitle}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => executeSearch(q)}
                className="text-center p-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 text-xs font-bold text-black dark:text-white hover:bg-[#007c8a]/15 transition-colors cursor-pointer"
              >
                <span className="line-clamp-2">{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state indicator Centered */}
      {loading && (
        <div className="glass-surface p-10 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border border-slate-200 text-center animate-pulse max-w-xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin text-[#007c8a] mx-auto mb-3" />
          <p className="text-base font-black text-black dark:text-white text-center">
            {t.searchGrounding.searching}
          </p>
          <p className="text-xs font-bold text-black dark:text-slate-300 mt-1 text-center">
            Grounding with ZSFGH Ward 86, SFDPH, and California ADAP repositories...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-[#c41230]/15 border-2 border-[#c41230] text-black text-xs font-bold flex items-center justify-center gap-2 max-w-xl mx-auto text-center">
          <ShieldAlert className="w-5 h-5 text-[#c41230] shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Results Box with CENTERED HEADER */}
      {result && !loading && (
        <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#001b2e]/90 border-2 border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Verified Live Information
              </span>
            </div>
            <div className="text-xs font-black text-black dark:text-white flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#007c8a]" />
              <span>Google Grounded</span>
            </div>
          </div>

          {/* Formatted Answer Body */}
          <div className="text-black dark:text-white text-sm font-bold leading-relaxed whitespace-pre-wrap">
            {result.answer}
          </div>

          {/* Verified Web Citations & Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#007c8a]/20">
              <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5 text-center">
                <CheckCircle className="w-4 h-4 text-[#007c8a]" />
                <span>{t.searchGrounding.sourcesTitle}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                {result.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 hover:border-[#007c8a] text-xs font-black text-black dark:text-white hover:underline transition-all"
                  >
                    <span className="truncate pr-2">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#007c8a]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Safety disclaimer Centered */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-black dark:text-slate-300 text-center flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-black shrink-0" />
            <span>{t.searchGrounding.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
