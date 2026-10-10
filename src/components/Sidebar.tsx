import React from 'react';
import {
  Compass,
  MapPin,
  Search,
  BookmarkCheck,
  LifeBuoy,
  Scale,
  ChevronsRight,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export type ActiveTab = 'directory' | 'pathway' | 'search' | 'carePlan' | 'emergency' | 'rights';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  open: boolean;
  setOpen: (val: boolean) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  open,
  setOpen,
  savedCount,
}) => {
  const t = translations[language] || translations.en;

  const menuItems = [
    {
      id: 'directory' as ActiveTab,
      icon: MapPin,
      label: t.nav.directory,
      desc: language === 'en' ? 'Clinics & Resources' : 'Clínicas y Recursos',
    },
    {
      id: 'pathway' as ActiveTab,
      icon: Compass,
      label: t.nav.pathway,
      desc: language === 'en' ? 'Step-by-Step Navigator' : 'Evaluación de Necesidades',
      badge: 'Interactive',
    },
    {
      id: 'search' as ActiveTab,
      icon: Search,
      label: t.nav.searchGrounding,
      desc: language === 'en' ? 'Google Search Grounded' : 'Búsqueda Verificada en Vivo',
      aiBadge: true,
    },
    {
      id: 'carePlan' as ActiveTab,
      icon: BookmarkCheck,
      label: t.nav.carePlan,
      desc: language === 'en' ? 'Checklist & Saved' : 'Documentos y Guardados',
      count: savedCount,
    },
    {
      id: 'emergency' as ActiveTab,
      icon: LifeBuoy,
      label: t.nav.emergency,
      desc: language === 'en' ? 'Ward 86 & Crisis lines' : 'Triaje Ward 86 y Crisis',
      urgent: true,
    },
    {
      id: 'rights' as ActiveTab,
      icon: Scale,
      label: t.nav.rights,
      desc: language === 'en' ? 'ADAP, Ryan White, ALRP' : 'ADAP, Derechos y Leyes',
    },
  ];

  return (
    <aside
      className={`glass-surface glass-sidebar shrink-0 transition-all duration-300 ease-in-out border-2 border-white/90 dark:border-white/20 ${
        open ? 'w-68' : 'w-20'
      } flex flex-col justify-between shadow-md select-none font-['Nunito_Sans']`}
    >
      <div className="p-3">
        {/* Navigation list */}
        <div className="space-y-2.5 pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
                aria-pressed={isSelected}
                className={`glass-nav relative flex items-center w-full rounded-2xl p-3 transition-all text-left group cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-[#002b49] text-white font-black shadow-lg shadow-[#002b49]/30 border-[#002b49]'
                    : 'bg-white/80 dark:bg-slate-800/80 text-black dark:text-white border-slate-200/80 dark:border-slate-700 hover:border-[#007c8a] hover:bg-white'
                }`}
              >
                <div
                  className={`grid size-10 shrink-0 place-content-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-[#007c8a] text-white shadow-xs'
                      : item.urgent
                      ? 'bg-[#c41230] text-white'
                      : 'bg-[#002b49]/10 text-[#002b49] group-hover:bg-[#007c8a] group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 text-current" />
                </div>

                {open && (
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`block text-sm font-black leading-tight truncate ${
                          isSelected ? 'text-white' : 'text-black dark:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.aiBadge && (
                        <span
                          className={`flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-md font-black ${
                            isSelected
                              ? 'bg-amber-400 text-black'
                              : 'bg-amber-100 text-black border border-amber-300'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          Live
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-black ${
                            isSelected ? 'bg-white text-[#002b49]' : 'bg-[#002b49] text-white'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                    <span
                      className={`block text-[11px] font-bold truncate mt-0.5 ${
                        isSelected ? 'text-teal-200' : 'text-black/80 dark:text-slate-300'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Toggle collapse */}
      <div className="p-3 border-t-2 border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          className="flex items-center justify-center w-full p-2.5 rounded-xl text-black dark:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer font-black"
        >
          <ChevronsRight
            className={`h-5 w-5 text-black dark:text-white transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
          {open && (
            <span className="ml-2 text-xs font-black text-black dark:text-white">
              {language === 'en' ? 'Collapse menu' : 'Minimizar'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
