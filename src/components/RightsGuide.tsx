import React from 'react';
import {
  Scale,
  ShieldCheck,
  FileText,
  Home,
  ExternalLink,
  HeartHandshake,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface RightsGuideProps {
  language: Language;
}

export const RightsGuide: React.FC<RightsGuideProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="space-y-6 font-['Nunito_Sans']">
      {/* Banner with CENTERED TEXT */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#001b2e]/80 border-2 border-white/80 dark:border-white/10 shadow-sm text-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#007c8a]/15 text-[#002b49] dark:bg-[#007c8a]/30 dark:text-teal-200 border border-[#007c8a]/30 mb-3 mx-auto">
            <Scale className="w-4 h-4 text-[#007c8a]" />
            <span>San Francisco Legal & Patient Rights</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white mb-2 text-center">
            {t.rights.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-black dark:text-slate-200 leading-relaxed text-center max-w-2xl mx-auto">
            {t.rights.subtitle}
          </p>
        </div>
      </div>

      {/* Guide Cards Grid with CENTERED CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* ADAP & OA-HIPP */}
        <div className="glass-surface p-6 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#007c8a]/15 text-[#007c8a] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-black dark:text-white text-center">
            {t.rights.adapSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black dark:text-slate-200 leading-relaxed text-center">
            {t.rights.adapSectionBody}
          </p>
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border-2 border-[#007c8a]/30 text-xs font-black text-black dark:text-white text-center">
            Up to ~500% Federal Poverty Level. Covers 100% of HIV medication.
          </div>
        </div>

        {/* Sanctuary & Immigration Rights */}
        <div className="glass-surface p-6 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-black dark:text-white text-center">
            {t.rights.undocSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black dark:text-slate-200 leading-relaxed text-center">
            {t.rights.undocSectionBody}
          </p>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-300 text-xs font-black text-black dark:text-white text-center">
            San Francisco is a Sanctuary City. Health clinics never report to ICE.
          </div>
        </div>

        {/* Ryan White Part A */}
        <div className="glass-surface p-6 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#e28f1b]/20 text-[#e28f1b] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-black dark:text-white text-center">
            {t.rights.ryanWhiteTitle}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black dark:text-slate-200 leading-relaxed text-center">
            {t.rights.ryanWhiteBody}
          </p>
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-800 border-2 border-[#e28f1b]/40 text-xs font-black text-black dark:text-white text-center">
            Federal payer of last resort: medical, dental, psychiatric, and food.
          </div>
        </div>

        {/* ALRP Eviction Defense & Tenant Rights */}
        <div className="glass-surface p-6 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#c41230]/15 text-[#c41230] flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-black dark:text-white text-center">
            {t.rights.alrpTitle}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black dark:text-slate-200 leading-relaxed text-center">
            {t.rights.alrpBody}
          </p>
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-slate-800 border-2 border-[#c41230]/30 text-xs font-black text-black dark:text-white flex items-center justify-between">
            <div>
              <strong>ALRP: </strong>
              <a href="tel:4157011100" className="underline font-black text-[#c41230]">
                (415) 701-1100
              </a>
            </div>
            <a
              href="https://alrp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-black text-[#005a9c] hover:underline"
            >
              <span>alrp.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
