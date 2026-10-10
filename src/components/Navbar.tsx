import React, { useState } from 'react';
import { Sun, Moon, AlertCircle, LogOut, HeartPulse, Menu, Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onOpenEmergency: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  isDark,
  setIsDark,
  onOpenEmergency,
  onToggleSidebar,
}) => {
  const t = translations[language] || translations.en;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // 6 Languages: English, Spanish, Chinese, Tagalog, Vietnamese, Russian
  const languagesList: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇲🇽' },
    { code: 'zh', label: '繁體中文', flag: '🇨🇳' },
    { code: 'tl', label: 'Tagalog', flag: '🇵🇭' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com/search?q=weather+san+francisco');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#001b2e]/90 border-b border-[#007c8a]/20 dark:border-white/10 shadow-sm transition-colors font-['Nunito_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & ZSFGH Ward 86 Inspired Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-black dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#002b49] via-[#005a9c] to-[#007c8a] flex items-center justify-center text-white shadow-md shadow-[#002b49]/25 shrink-0">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-black dark:text-white tracking-tight leading-none">
                  Next Step SF
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-full bg-[#007c8a]/15 text-[#002b49] dark:bg-[#007c8a]/30 dark:text-teal-200 border border-[#007c8a]/30">
                  SF HIV Navigator
                </span>
              </div>
              <p className="hidden md:block text-xs font-bold text-black dark:text-slate-200 leading-tight mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Urgent Emergency Beacon Button (ZSFGH Trauma Red) */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c41230] hover:bg-[#a61028] active:scale-95 text-white text-xs font-black shadow-md shadow-[#c41230]/30 transition-all cursor-pointer"
            aria-label={t.emergencyCrisis}
          >
            <AlertCircle className="w-4 h-4 text-white animate-pulse" />
            <span className="hidden sm:inline text-white">{t.emergencyCrisis}</span>
            <span className="sm:hidden text-white">Ward 86</span>
          </button>

          {/* 6-Language Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#002b49] border-2 border-[#007c8a]/30 text-black dark:text-white text-xs font-black shadow-xs hover:border-[#007c8a] transition-all cursor-pointer"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-[#007c8a]" />
              <span>{currentLang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-black dark:text-white opacity-70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#001b2e] border-2 border-[#007c8a]/30 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-black dark:text-teal-300 border-b border-slate-100 dark:border-slate-800">
                  Select Language (6 Options)
                </div>
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-black text-left cursor-pointer transition-colors ${
                      language === lang.code
                        ? 'bg-[#002b49] text-white'
                        : 'text-black dark:text-white hover:bg-[#007c8a]/15'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {language === lang.code && <span className="text-white text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#002b49] hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-[#007c8a]/30 text-black dark:text-white transition-colors cursor-pointer shadow-xs"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#002b49]" />}
          </button>

          {/* Quick Privacy Exit */}
          <button
            onClick={handleQuickExit}
            title={t.quickExitTooltip}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-black text-xs font-black border border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-black" />
            <span className="hidden lg:inline text-black">{t.quickExit}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
