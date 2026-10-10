import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Printer,
  BookmarkPlus,
  Phone,
  MapPin,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Language, ServiceResource } from '../types';
import { translations } from '../data/translations';
import { sfServices } from '../data/services';

interface PathwayNavigatorProps {
  language: Language;
  onSaveServices: (ids: string[]) => void;
  savedItemIds: string[];
}

export const PathwayNavigator: React.FC<PathwayNavigatorProps> = ({
  language,
  onSaveServices,
  savedItemIds,
}) => {
  const t = translations[language] || translations.en;

  // Assessment Questions State
  const [need, setNeed] = useState<string>('newDiagnosis');
  const [insurance, setInsurance] = useState<string>('none');
  const [preferredArea, setPreferredArea] = useState<string>('any');
  const [preferBilingual, setPreferBilingual] = useState<boolean>(true);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Generate prioritized pathway based on inputs
  const recommendedServices = React.useMemo(() => {
    if (!isGenerated) return [];

    const list: Array<{ priority: number; priorityLabel: string; service: ServiceResource; reason: string }> = [];

    // Priority 1: Clinical & Medical
    const ward86 = sfServices.find((s) => s.id === 'ward-86-zsfgh');
    const clinicaEsperanza = sfServices.find((s) => s.id === 'mnhc-clinica-esperanza');
    const tomWaddell = sfServices.find((s) => s.id === 'tom-waddell-urban-health');
    const castroMission = sfServices.find((s) => s.id === 'castro-mission-health-center');

    if (need === 'newDiagnosis' || need === 'medCrisis') {
      if (preferBilingual && language === 'es' && clinicaEsperanza) {
        list.push({
          priority: 1,
          priorityLabel: t.pathway.priority1,
          service: clinicaEsperanza,
          reason: 'Clínica 100% bilingüe en español con inicio de medicamento el mismo día y trabajadores sociales latinos.',
        });
      } else if (need === 'medCrisis' && tomWaddell && (preferredArea === 'Tenderloin' || preferredArea === 'SoMa')) {
        list.push({
          priority: 1,
          priorityLabel: t.pathway.priority1,
          service: tomWaddell,
          reason: 'Low-barrier morning walk-in triage with instant bridge medication refills in the Tenderloin.',
        });
      } else if (ward86) {
        list.push({
          priority: 1,
          priorityLabel: t.pathway.priority1,
          service: ward86,
          reason: 'ZSFGH Ward 86: World-leading Rapid ART clinic with same-day medication and walk-in POP-UP clinic.',
        });
      }
    } else if (need === 'relocating') {
      const chosen = castroMission || ward86;
      if (chosen) {
        list.push({
          priority: 1,
          priorityLabel: t.pathway.priority1,
          service: chosen,
          reason: 'Comprehensive SF health clinic to transfer HIV records, lab orders, and establish primary care.',
        });
      }
    } else {
      const magnet = sfServices.find((s) => s.id === 'magnet-strut-sfaf');
      if (magnet) {
        list.push({
          priority: 1,
          priorityLabel: t.pathway.priority1,
          service: magnet,
          reason: 'Community health and sexual wellness navigation hub.',
        });
      }
    }

    // Priority 2: ADAP & Coverage
    const centralAdap = sfServices.find((s) => s.id === 'sfdph-adap-central');
    const prc = sfServices.find((s) => s.id === 'prc-benefits-legal');

    if (insurance === 'none' || insurance === 'unsure') {
      if (centralAdap) {
        list.push({
          priority: 2,
          priorityLabel: t.pathway.priority2,
          service: centralAdap,
          reason: 'Authorizes immediate emergency 30-day medication cards and enrolls in 100% free drug coverage.',
        });
      }
    } else if (prc) {
      list.push({
        priority: 2,
        priorityLabel: t.pathway.priority2,
        service: prc,
        reason: 'Assistance coordinating OA-HIPP to pay private premiums and filing for disability or Medi-Cal.',
      });
    }

    // Priority 3: Food & Nutrition Wraparound
    const openHand = sfServices.find((s) => s.id === 'project-open-hand');
    const shanti = sfServices.find((s) => s.id === 'shanti-project-hiv');

    if (openHand) {
      list.push({
        priority: 3,
        priorityLabel: t.pathway.priority3,
        service: openHand,
        reason: 'Free weekly medically tailored groceries and fresh meals to maintain immune strength.',
      });
    } else if (shanti) {
      list.push({
        priority: 3,
        priorityLabel: t.pathway.priority3,
        service: shanti,
        reason: 'Peer companionship, free pet care (PAWS), and emotional support.',
      });
    }

    // Priority 4: Housing & Legal Security
    const alrp = sfServices.find((s) => s.id === 'alrp-legal-referral');
    const plusHousing = sfServices.find((s) => s.id === 'sf-plus-housing-hopwa');

    if (need === 'housingCrisis' && plusHousing) {
      list.push({
        priority: 4,
        priorityLabel: t.pathway.priority4,
        service: plusHousing,
        reason: 'Centralized HIV housing waitlist, shallow rent subsidies, and HOPWA supportive housing access.',
      });
    } else if (alrp) {
      list.push({
        priority: 4,
        priorityLabel: t.pathway.priority4,
        service: alrp,
        reason: 'Free legal defense against evictions, landlord harassment, and immigration asylum assistance.',
      });
    }

    return list;
  }, [isGenerated, need, insurance, preferredArea, preferBilingual, language]);

  const handleSaveAll = () => {
    const ids = recommendedServices.map((r) => r.service.id);
    onSaveServices(ids);
  };

  return (
    <div className="space-y-6 font-['Nunito_Sans']">
      {/* Hero Header with CENTERED TEXT */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#001b2e] border-2 border-slate-300 dark:border-white/20 shadow-md text-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#002b49] text-white border-2 border-[#002b49] mb-3 mx-auto">
            <Compass className="w-4 h-4 text-white" />
            <span className="text-white">ZSFGH Ward 86 Intake & Navigation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white mb-2 text-center">
            {t.pathway.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-black dark:text-white leading-relaxed text-center max-w-2xl mx-auto">
            {t.pathway.subtitle}
          </p>
        </div>

        {/* Assessment Questionnaire Form with CENTERED HEADINGS */}
        <div className="mt-8 space-y-6 max-w-3xl mx-auto text-center">
          {/* Question 1: Immediate Need */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-center shadow-xs">
            <label className="block text-base font-black text-black dark:text-white mb-4 text-center">
              {t.pathway.step1Title}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              {[
                { id: 'newDiagnosis', label: t.pathway.needs.newDiagnosis, icon: '🩺' },
                { id: 'medCrisis', label: t.pathway.needs.medCrisis, icon: '🚨' },
                { id: 'relocating', label: t.pathway.needs.relocating, icon: '🌁' },
                { id: 'housingCrisis', label: t.pathway.needs.housingCrisis, icon: '🏠' },
                { id: 'nutritionHelp', label: t.pathway.needs.nutritionHelp, icon: '🥗' },
                { id: 'dentalMental', label: t.pathway.needs.dentalMental, icon: '🧠' },
                { id: 'agingWell', label: t.pathway.needs.agingWell, icon: '🌟' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNeed(item.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    need === item.id
                      ? 'bg-[#002b49] text-white border-[#002b49] font-black shadow-lg shadow-[#002b49]/30'
                      : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white hover:border-[#002b49] font-black'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs leading-snug">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Insurance Status */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-center shadow-xs">
            <label className="block text-base font-black text-black dark:text-white mb-4 text-center">
              {t.pathway.step2Title}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              {[
                { id: 'none', label: t.pathway.insuranceTypes.none },
                { id: 'mediCal', label: t.pathway.insuranceTypes.mediCal },
                { id: 'adapEnrolled', label: t.pathway.insuranceTypes.adapEnrolled },
                { id: 'private', label: t.pathway.insuranceTypes.private },
                { id: 'unsure', label: t.pathway.insuranceTypes.unsure },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setInsurance(item.id)}
                  className={`p-3.5 rounded-xl border-2 text-center text-xs font-black transition-all cursor-pointer ${
                    insurance === item.id
                      ? 'bg-[#002b49] text-white border-[#002b49] shadow-lg shadow-[#002b49]/30'
                      : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white hover:border-[#002b49]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Language Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-center shadow-xs">
              <label className="block text-sm font-black text-black dark:text-white mb-2 text-center">
                {t.pathway.step3Title}
              </label>
              <select
                value={preferredArea}
                onChange={(e) => setPreferredArea(e.target.value)}
                className="w-full py-3 px-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-400 text-black dark:text-white text-xs font-black text-center cursor-pointer"
              >
                <option value="any">{t.neighborhoods.all}</option>
                <option value="Mission">{t.neighborhoods.Mission}</option>
                <option value="Castro">{t.neighborhoods.Castro}</option>
                <option value="Tenderloin">{t.neighborhoods.Tenderloin}</option>
                <option value="SoMa">{t.neighborhoods.SoMa}</option>
                <option value="Potrero">{t.neighborhoods.Potrero}</option>
                <option value="Bayview">{t.neighborhoods.Bayview}</option>
                <option value="Western Addition">{t.neighborhoods['Western Addition']}</option>
              </select>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-center flex flex-col justify-between shadow-xs">
              <label className="block text-sm font-black text-black dark:text-white mb-2 text-center">
                {t.pathway.step4Title}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreferBilingual(true)}
                  className={`flex-1 py-3 px-3 rounded-xl border-2 text-xs font-black cursor-pointer ${
                    preferBilingual
                      ? 'bg-[#007c8a] text-white border-[#007c8a] shadow-md'
                      : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white'
                  }`}
                >
                  {t.common.yes}
                </button>
                <button
                  type="button"
                  onClick={() => setPreferBilingual(false)}
                  className={`flex-1 py-3 px-3 rounded-xl border-2 text-xs font-black cursor-pointer ${
                    !preferBilingual
                      ? 'bg-[#002b49] text-white border-[#002b49] shadow-md'
                      : 'bg-white dark:bg-slate-800 border-slate-300 text-black dark:text-white'
                  }`}
                >
                  {t.common.no} / English
                </button>
              </div>
            </div>
          </div>

          {/* Generate Action Button Centered */}
          <button
            onClick={() => setIsGenerated(true)}
            className="w-full py-4 px-6 rounded-2xl bg-[#002b49] hover:bg-[#001729] active:scale-98 text-white font-black text-base shadow-xl shadow-[#002b49]/35 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-white">{t.pathway.generatePlan}</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Generated Plan Section with CENTERED TEXT */}
      {isGenerated && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="glass-surface p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#001b2e] border-2 border-slate-300 dark:border-white/20 shadow-lg text-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200 dark:border-slate-800 text-center sm:text-left">
              <div className="text-center sm:text-left">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  ✓ Action Plan Ready
                </span>
                <h2 className="text-2xl font-black text-black dark:text-white mt-1">
                  {t.pathway.planGenerated}
                </h2>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#007c8a] hover:bg-[#00616c] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-white" />
                  <span className="text-white">{t.pathway.saveToPlanButton}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-black font-black text-xs transition-all cursor-pointer border border-slate-400"
                >
                  <Printer className="w-4 h-4 text-black" />
                  <span className="text-black">{t.common.print}</span>
                </button>
              </div>
            </div>

            {/* Stepped Pathway Cards */}
            <div className="mt-6 space-y-4">
              {recommendedServices.map((rec) => (
                <div
                  key={rec.service.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
                >
                  <div className="space-y-2 max-w-2xl text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#002b49] text-white">
                        {rec.priorityLabel}
                      </span>
                      {rec.service.walkIn && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-700 text-white">
                          ⚡ {t.directory.walkInBadge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-black dark:text-white">
                      {rec.service.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-black dark:text-white leading-relaxed">
                      {rec.reason}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-black text-black dark:text-slate-300 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span>{rec.service.address}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#002b49]" />
                        <a href={`tel:${rec.service.phone.replace(/[^0-9]/g, '')}`} className="font-black underline text-[#002b49] dark:text-teal-300">
                          {rec.service.phone}
                        </a>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center gap-2">
                    <a
                      href={`tel:${rec.service.phone.replace(/[^0-9]/g, '')}`}
                      className="px-6 py-3 rounded-xl bg-[#002b49] hover:bg-[#001729] text-white font-black text-xs text-center transition-all shadow-md"
                    >
                      {t.common.callNow}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Checklist Box Centered */}
            <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-600 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <h3 className="text-base font-black text-black dark:text-white text-center">
                  {t.pathway.checklistTitle}
                </h3>
              </div>
              <p className="text-xs font-black text-black dark:text-slate-200 mb-4 text-center">
                {t.pathway.checklistDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                {[
                  { title: t.carePlan.docs.id, desc: t.carePlan.docs.idDesc },
                  { title: t.carePlan.docs.residency, desc: t.carePlan.docs.residencyDesc },
                  { title: t.carePlan.docs.income, desc: t.carePlan.docs.incomeDesc },
                  { title: t.carePlan.docs.medical, desc: t.carePlan.docs.medicalDesc },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 text-xs text-center"
                  >
                    <div className="font-black text-black dark:text-white mb-1 text-center">
                      {item.title}
                    </div>
                    <p className="text-[11px] font-bold text-black dark:text-white leading-normal text-center">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
