import React from 'react';
import {
  AlertOctagon,
  Phone,
  X,
  ShieldAlert,
  HeartHandshake,
  Pill,
  Hospital,
  Clock,
  LogOut,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language] || translations.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/70 animate-in fade-in duration-200 font-['Nunito_Sans']">
      <div
        className="glass-surface relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#001b2e]/95 border-2 border-[#c41230]/40 shadow-2xl p-6 sm:p-8 text-black dark:text-white text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-black dark:text-white transition-colors cursor-pointer"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Header */}
        <div className="text-center max-w-md mx-auto mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c41230] text-white flex items-center justify-center shadow-lg shadow-[#c41230]/30 mx-auto mb-3">
            <AlertOctagon className="w-6 h-6 animate-pulse text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#c41230] tracking-tight text-center">
            {t.emergency.title}
          </h2>
          <p className="text-xs font-bold text-black dark:text-slate-200 mt-1 text-center">
            {t.emergency.subtitle}
          </p>
        </div>

        {/* Emergency Helplines Cards */}
        <div className="space-y-3.5 mb-6 text-center">
          {/* Ward 86 Urgent Triage at ZSFGH */}
          <div className="p-4 rounded-2xl bg-[#c41230]/15 border-2 border-[#c41230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Hospital className="w-4 h-4 text-[#c41230]" />
                <h3 className="text-sm font-black text-black dark:text-white">
                  {t.emergency.ward86TriageTitle}
                </h3>
              </div>
              <p className="text-xs font-bold text-black dark:text-slate-200 mt-0.5">
                {t.emergency.ward86TriageDesc}
              </p>
            </div>
            <a
              href="tel:6282062400"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c41230] hover:bg-[#a61028] text-white font-black text-xs shadow-md transition-all shrink-0 mx-auto sm:mx-0"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>(628) 206-2400</span>
            </a>
          </div>

          {/* 988 Suicide & Crisis Lifeline */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <HeartHandshake className="w-4 h-4 text-[#002b49]" />
                <h3 className="text-sm font-black text-black dark:text-white">
                  {t.emergency.crisisLineTitle}
                </h3>
              </div>
              <p className="text-xs font-bold text-black dark:text-slate-300 mt-0.5">
                {t.emergency.crisisLineDesc}
              </p>
            </div>
            <a
              href="tel:988"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#002b49] hover:bg-[#001f35] text-white font-black text-xs shadow-md transition-all shrink-0 mx-auto sm:mx-0"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>988</span>
            </a>
          </div>

          {/* California Peer Warm Line */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Clock className="w-4 h-4 text-[#007c8a]" />
                <h3 className="text-sm font-black text-black dark:text-white">
                  {t.emergency.peerWarmLineTitle}
                </h3>
              </div>
              <p className="text-xs font-bold text-black dark:text-slate-300 mt-0.5">
                {t.emergency.peerWarmLineDesc}
              </p>
            </div>
            <a
              href="tel:8558457410"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#007c8a] hover:bg-[#006672] text-white font-black text-xs shadow-md transition-all shrink-0 mx-auto sm:mx-0"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>(855) 845-7410</span>
            </a>
          </div>
        </div>

        {/* Immediate Refill Advice Box Centered */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-800 border-2 border-[#007c8a]/40 mb-6 text-xs font-bold text-black dark:text-white space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5 font-black text-center text-sm text-[#002b49] dark:text-teal-200">
            <Pill className="w-4 h-4 text-[#007c8a]" />
            <span>Out of HIV medication today or lost your prescription?</span>
          </div>
          <p className="leading-relaxed text-center">
            Walk directly into Ward 86 at SF General (Building 80, 6th Fl) Mon–Fri between 8am and 3pm, or visit Central ADAP at 25 Van Ness Ave for an immediate 30-day emergency bridge supply.
          </p>
        </div>

        {/* Footer with Quick Exit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center sm:text-left">
          <span className="text-black dark:text-slate-300 text-[11px] font-bold">
            {t.emergency.safetyTip}
          </span>
          <button
            onClick={() => {
              window.location.replace('https://www.google.com/search?q=weather+san+francisco');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-black font-black cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 text-black" />
            <span>{t.quickExit}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
