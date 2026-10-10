import React, { useState, useEffect } from 'react';
import {
  BookmarkCheck,
  FileCheck2,
  Phone,
  Trash2,
  Printer,
  Lock,
} from 'lucide-react';
import { Language, getLocalized } from '../types';
import { translations } from '../data/translations';
import { sfServices } from '../data/services';

interface CarePlanVaultProps {
  language: Language;
  savedItemIds: string[];
  onRemoveService: (id: string) => void;
  onClearAll: () => void;
  onNavigateToDirectory: () => void;
}

export const CarePlanVault: React.FC<CarePlanVaultProps> = ({
  language,
  savedItemIds,
  onRemoveService,
  onClearAll,
  onNavigateToDirectory,
}) => {
  const t = translations[language] || translations.en;

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('nextstep_careplan_notes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('nextstep_doc_checklist');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nextstep_careplan_notes', JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('nextstep_doc_checklist', JSON.stringify(checkedDocs));
    } catch (e) {
      console.error(e);
    }
  }, [checkedDocs]);

  const handleNoteChange = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  const handleDocToggle = (docId: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const savedServices = sfServices.filter((s) => savedItemIds.includes(s.id));

  const docList = [
    {
      id: 'residency',
      title: t.carePlan.docs.residency,
      desc: t.carePlan.docs.residencyDesc,
    },
    {
      id: 'income',
      title: t.carePlan.docs.income,
      desc: t.carePlan.docs.incomeDesc,
    },
    {
      id: 'id',
      title: t.carePlan.docs.id,
      desc: t.carePlan.docs.idDesc,
    },
    {
      id: 'medical',
      title: t.carePlan.docs.medical,
      desc: t.carePlan.docs.medicalDesc,
    },
    {
      id: 'insurance',
      title: t.carePlan.docs.insurance,
      desc: t.carePlan.docs.insuranceDesc,
    },
  ];

  const checkedCount = docList.filter((d) => checkedDocs[d.id]).length;

  return (
    <div className="space-y-6 font-['Nunito_Sans']">
      {/* Top Banner with CENTERED TEXT */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#001b2e]/80 border-2 border-white/80 dark:border-white/10 shadow-sm text-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#007c8a]/15 text-[#002b49] dark:bg-[#007c8a]/30 dark:text-teal-200 border border-[#007c8a]/30 mb-3 mx-auto">
            <Lock className="w-4 h-4 text-[#007c8a]" />
            <span>Confidential Offline Vault</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white mb-2 text-center">
            {t.carePlan.title}
          </h1>
          <p className="text-sm font-bold text-black dark:text-slate-200 text-center max-w-2xl mx-auto mb-4">
            {t.carePlan.subtitle}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#002b49] hover:bg-[#001f35] text-white text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>{t.common.print}</span>
            </button>
            {savedServices.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(t.carePlan.confirmClear)) {
                    onClearAll();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-[#c41230] text-xs font-black transition-all cursor-pointer border border-[#c41230]/30"
              >
                <Trash2 className="w-4 h-4 text-[#c41230]" />
                <span>{t.carePlan.clearAll}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Checklist Box with CENTERED HEADER */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-sm text-center max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl font-black text-black dark:text-white flex items-center justify-center gap-2 text-center">
            <FileCheck2 className="w-5 h-5 text-[#007c8a]" />
            <span>{t.carePlan.docChecklist}</span>
          </h2>
          <p className="text-xs font-bold text-black dark:text-slate-200 mt-1 text-center">
            {t.carePlan.docChecklistDesc}
          </p>
          <div className="text-center mt-2">
            <span className="text-xs font-black text-[#005a9c]">
              {checkedCount} / {docList.length} Ready
            </span>
          </div>
        </div>

        {/* Progress Bar Centered */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-[#007c8a] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / docList.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3 text-center">
          {docList.map((doc) => {
            const isChecked = !!checkedDocs[doc.id];
            return (
              <div
                key={doc.id}
                onClick={() => handleDocToggle(doc.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-3.5 text-center sm:text-left ${
                  isChecked
                    ? 'bg-emerald-100/90 border-emerald-600 text-black'
                    : 'bg-white dark:bg-slate-800 border-slate-200 text-black dark:text-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-5 h-5 rounded-lg text-emerald-700 cursor-pointer shrink-0"
                />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="text-sm font-black text-black dark:text-white">
                    {doc.title}
                  </div>
                  <p className="text-xs font-bold text-black dark:text-slate-300 mt-0.5">
                    {doc.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Providers Section with CENTERED HEADERS */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#001b2e]/85 border-2 border-white/80 dark:border-white/10 shadow-sm text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-black text-black dark:text-white mb-4 flex items-center justify-center gap-2 text-center">
          <BookmarkCheck className="w-5 h-5 text-[#002b49]" />
          <span>{t.carePlan.savedServices} ({savedServices.length})</span>
        </h2>

        {savedServices.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200">
            <p className="text-xs sm:text-sm font-bold text-black dark:text-slate-300 mb-4 text-center">
              {t.carePlan.noSavedServices}
            </p>
            <button
              onClick={onNavigateToDirectory}
              className="px-5 py-3 rounded-xl bg-[#002b49] hover:bg-[#001f35] text-white font-black text-xs shadow-xs transition-all cursor-pointer"
            >
              Browse Directory
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedServices.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#007c8a]/20 shadow-xs space-y-3 text-center"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 text-center sm:text-left">
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#007c8a]">
                      {t.categories[service.category]} • {service.neighborhood}
                    </span>
                    <h3 className="text-lg font-black text-black dark:text-white mt-0.5 text-center sm:text-left">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#002b49] text-white text-xs font-black"
                    >
                      <Phone className="w-3.5 h-3.5 text-white" />
                      <span>{service.phone}</span>
                    </a>
                    <button
                      onClick={() => onRemoveService(service.id)}
                      className="p-2 rounded-xl text-black hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-black dark:text-slate-200 text-center">
                  <span className="font-black text-[#002b49]">{t.common.hours}: </span>
                  {getLocalized(service.hours, language)}
                </div>

                <div>
                  <label className="block text-[11px] font-black text-black dark:text-white uppercase tracking-wider mb-1.5 text-center">
                    {t.common.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={notes[service.id] || ''}
                    onChange={(e) => handleNoteChange(service.id, e.target.value)}
                    placeholder={t.carePlan.notesPlaceholder}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 text-xs font-bold text-black dark:text-white placeholder:text-black/60 focus:ring-2 focus:ring-[#007c8a] focus:outline-none text-center sm:text-left"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
