import React from 'react';
import {
  X,
  Phone,
  MapPin,
  ExternalLink,
  Clock,
  Languages,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  FileText,
  Bus,
  ShieldCheck,
} from 'lucide-react';
import { ServiceResource, Language, getLocalized, getLocalizedList } from '../types';
import { translations } from '../data/translations';

interface ServiceDetailModalProps {
  service: ServiceResource | null;
  onClose: () => void;
  language: Language;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  language,
  isSaved,
  onToggleSave,
}) => {
  if (!service) return null;
  const t = translations[language] || translations.en;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${service.name} ${service.address}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/75 animate-in fade-in duration-200 font-['Nunito_Sans']">
      <div
        className="glass-surface relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#001b2e] border-2 border-slate-400 dark:border-white/30 shadow-2xl p-6 sm:p-8 text-black dark:text-white"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-black dark:text-white transition-colors cursor-pointer border border-slate-400"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5 text-black dark:text-white" />
        </button>

        {/* Centered Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#002b49] text-white">
              {t.categories[service.category]}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-slate-200 border border-slate-400 text-black">
              📍 {service.neighborhood}
            </span>
            {service.walkIn && (
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-700 text-white">
                ⚡ {t.directory.walkInBadge}
              </span>
            )}
            {service.rapidArtAvailable && (
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#c41230] text-white">
                💊 {t.directory.rapidArtBadge}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white mb-2 leading-tight">
            {service.name}
          </h2>
          <p className="text-sm sm:text-base font-bold text-black dark:text-white leading-relaxed">
            {getLocalized(service.longDesc, language)}
          </p>
        </div>

        {/* Action Buttons Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
          <a
            href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#002b49] hover:bg-[#001729] text-white font-black text-sm transition-all shadow-md text-center cursor-pointer"
          >
            <Phone className="w-4 h-4 text-white" />
            <span className="text-white">{service.phone}</span>
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#007c8a] hover:bg-[#00616c] text-white font-black text-sm transition-all shadow-md text-center cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-white">{t.common.getDirections}</span>
          </a>

          <button
            onClick={() => onToggleSave(service.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all cursor-pointer border-2 ${
              isSaved
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                : 'bg-white text-black border-[#002b49] hover:bg-slate-100'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-white" />
                <span className="text-white">{t.common.inPlan}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#002b49]" />
                <span className="text-black">{t.common.saveToPlan}</span>
              </>
            )}
          </button>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Hours & Walk-in & Languages */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-black text-black dark:text-white mb-1">
                <Clock className="w-4 h-4 text-[#002b49] dark:text-teal-300" />
                <span>{t.common.hours}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-black dark:text-white mb-2">
                {getLocalized(service.hours, language)}
              </p>
              {service.walkInDetails && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-xs font-black text-emerald-950 dark:text-emerald-100">
                  <span className="font-black text-emerald-900 dark:text-emerald-300">Walk-in: </span>
                  {getLocalized(service.walkInDetails, language)}
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-black text-black dark:text-white mb-2">
                <Languages className="w-4 h-4 text-[#b45309]" />
                <span>{t.common.languages}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-700 text-black dark:text-white border border-slate-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-black text-black dark:text-white mb-1">
                <Bus className="w-4 h-4 text-[#005a9c]" />
                <span>{t.common.transit}</span>
              </div>
              <p className="text-xs font-bold text-black dark:text-white">
                {getLocalized(service.transitNotes, language)}
              </p>
            </div>
          </div>

          {/* Services & Insurance */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-black text-black dark:text-white mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Services</span>
              </div>
              <ul className="space-y-1.5">
                {getLocalizedList(service.servicesOffered, language).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-bold text-black dark:text-white">
                    <span className="text-[#007c8a] font-black shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-black text-black dark:text-white mb-1">
                <ShieldCheck className="w-4 h-4 text-[#002b49]" />
                <span>{t.common.insurance}</span>
              </div>
              <p className="text-xs font-bold text-black dark:text-white mb-2">
                {getLocalized(service.eligibility, language)}
              </p>
              <div className="flex flex-wrap gap-1">
                {service.insuranceAccepted.map((ins, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded text-[11px] font-black bg-slate-200 border border-slate-400 text-black"
                  >
                    {ins}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What to Bring Checklist */}
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-600 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm font-black text-black dark:text-white mb-2">
            <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>{t.common.whatToBring}</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center sm:text-left">
            {getLocalizedList(service.docsNeeded, language).map((doc, idx) => (
              <li
                key={idx}
                className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-black dark:text-white border border-slate-300"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Centered Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-slate-300 dark:border-slate-800 text-xs font-black text-black dark:text-white text-center sm:text-left">
          <p className="truncate">
            <span className="font-black text-[#002b49] dark:text-teal-300">Address: </span>
            {service.address}
          </p>
          <a
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#005a9c] hover:underline font-black shrink-0"
          >
            <span>{t.common.visitWebsite}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
