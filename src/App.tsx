import React, { useState, useEffect, useId } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ServiceDirectory } from './components/ServiceDirectory';
import { PathwayNavigator } from './components/PathwayNavigator';
import { LiveSearchGrounding } from './components/LiveSearchGrounding';
import { CarePlanVault } from './components/CarePlanVault';
import { RightsGuide } from './components/RightsGuide';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { LiquidGlassFilter } from './components/LiquidGlassFilter';
import { Language } from './types';
import { translations } from './data/translations';
import { HeartPulse, LogOut } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('nextstep_theme');
      return stored ? stored === 'dark' : false;
    } catch {
      return false;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('nextstep_lang') as Language;
      return ['en', 'es', 'zh', 'tl', 'vi', 'ru'].includes(stored) ? stored : 'en';
    } catch {
      return 'en';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Saved service IDs in local storage
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nextstep_saved_services');
      return stored ? JSON.parse(stored) : ['ward-86-zsfgh', 'project-open-hand'];
    } catch {
      return ['ward-86-zsfgh', 'project-open-hand'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nextstep_theme', isDark ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('nextstep_lang', language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('nextstep_saved_services', JSON.stringify(savedItemIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedItemIds]);

  const filterId = `glass-${useId().replace(/:/g, '')}`;

  const handleToggleSave = (id: string) => {
    setSavedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveMultiple = (ids: string[]) => {
    setSavedItemIds((prev) => {
      const set = new Set([...prev, ...ids]);
      return Array.from(set);
    });
  };

  const handleRemoveService = (id: string) => {
    setSavedItemIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearAllSaved = () => {
    setSavedItemIds([]);
    try {
      localStorage.removeItem('nextstep_careplan_notes');
      localStorage.removeItem('nextstep_doc_checklist');
    } catch (e) {
      console.error(e);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div
      className={`liquid-dashboard min-h-screen w-full flex flex-col font-['Nunito_Sans'] ${isDark ? 'dark' : ''}`}
      style={{ '--glass-filter': `url(#${filterId})` } as React.CSSProperties}
    >
      <LiquidGlassFilter id={filterId} />

      {/* Top Navbar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="dashboard-shell flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            language={language}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            savedCount={savedItemIds.length}
          />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex font-['Nunito_Sans']">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-white dark:bg-[#001b2e] shadow-2xl p-4 flex flex-col justify-between">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false);
                }}
                language={language}
                open={true}
                setOpen={() => setMobileSidebarOpen(false)}
                savedCount={savedItemIds.length}
              />
            </div>
          </div>
        )}

        {/* Main Content View with CENTERED LAYOUT */}
        <main className="dashboard-main flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          {activeTab === 'directory' && (
            <ServiceDirectory
              language={language}
              savedItemIds={savedItemIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {activeTab === 'pathway' && (
            <PathwayNavigator
              language={language}
              onSaveServices={handleSaveMultiple}
              savedItemIds={savedItemIds}
            />
          )}

          {activeTab === 'search' && <LiveSearchGrounding language={language} />}

          {activeTab === 'carePlan' && (
            <CarePlanVault
              language={language}
              savedItemIds={savedItemIds}
              onRemoveService={handleRemoveService}
              onClearAll={handleClearAllSaved}
              onNavigateToDirectory={() => setActiveTab('directory')}
            />
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-6 max-w-3xl mx-auto text-center">
              <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-[#c41230]/40 shadow-md text-center">
                <h1 className="text-2xl sm:text-4xl font-black text-[#c41230] mb-2 text-center">
                  {t.emergency.title}
                </h1>
                <p className="text-sm font-bold text-black dark:text-slate-200 max-w-2xl mx-auto mb-6 text-center">
                  {t.emergency.subtitle}
                </p>

                <div className="p-5 rounded-2xl bg-[#c41230]/15 border-2 border-[#c41230] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-center sm:text-left">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-black text-black dark:text-white">
                      {t.emergency.ward86TriageTitle}
                    </h3>
                    <p className="text-xs font-bold text-black dark:text-slate-200 mt-1">
                      {t.emergency.ward86TriageDesc}
                    </p>
                  </div>
                  <a
                    href="tel:6282062400"
                    className="px-6 py-3 rounded-xl bg-[#c41230] hover:bg-[#a61028] text-white font-black text-sm text-center shadow-md transition-all shrink-0 mx-auto sm:mx-0"
                  >
                    Call (628) 206-2400
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 flex flex-col items-center justify-center text-center">
                    <h4 className="text-sm font-black text-black dark:text-white mb-1 text-center">
                      {t.emergency.crisisLineTitle}
                    </h4>
                    <p className="text-xs font-bold text-black dark:text-slate-300 mb-3 text-center">
                      {t.emergency.crisisLineDesc}
                    </p>
                    <a
                      href="tel:988"
                      className="px-4 py-2 rounded-xl bg-[#002b49] text-white font-black text-xs"
                    >
                      Call / Text 988
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 flex flex-col items-center justify-center text-center">
                    <h4 className="text-sm font-black text-black dark:text-white mb-1 text-center">
                      {t.emergency.peerWarmLineTitle}
                    </h4>
                    <p className="text-xs font-bold text-black dark:text-slate-300 mb-3 text-center">
                      {t.emergency.peerWarmLineDesc}
                    </p>
                    <a
                      href="tel:8558457410"
                      className="px-4 py-2 rounded-xl bg-[#007c8a] text-white font-black text-xs"
                    >
                      (855) 845-7410
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rights' && <RightsGuide language={language} />}

          {/* Centered Footer */}
          <footer className="mt-12 pt-6 pb-8 border-t border-slate-300/80 dark:border-slate-800 text-xs font-bold text-black dark:text-slate-300 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-center">
              <HeartPulse className="w-4 h-4 text-[#c41230] shrink-0" />
              <span>
                Next Step SF • ZSFGH Ward 86 & San Francisco Care Network.
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  window.location.replace('https://www.google.com/search?q=weather+san+francisco')
                }
                className="text-xs font-black text-black dark:text-white hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.quickExit}</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Instant Emergency Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
      />
    </div>
  );
}
