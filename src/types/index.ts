export type Language = 'en' | 'es' | 'zh' | 'tl' | 'vi' | 'ru';

export type ServiceCategory =
  | 'clinical'
  | 'adap'
  | 'housing'
  | 'nutrition'
  | 'harm_reduction'
  | 'legal'
  | 'mental_health'
  | 'dental'
  | 'youth';

export type SFNeighborhood =
  | 'Castro'
  | 'Mission'
  | 'Tenderloin'
  | 'SoMa'
  | 'Bayview'
  | 'Potrero'
  | 'Western Addition'
  | 'Civic Center'
  | 'Citywide';

export type LocalizedString = Record<Language, string>;
export type LocalizedStringList = Record<Language, string[]>;

export interface ServiceResource {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDesc: Partial<Record<Language, string>> & { en: string; es: string };
  longDesc: Partial<Record<Language, string>> & { en: string; es: string };
  address: string;
  neighborhood: SFNeighborhood;
  phone: string;
  altPhone?: string;
  website: string;
  hours: Partial<Record<Language, string>> & { en: string; es: string };
  walkIn: boolean;
  walkInDetails: Partial<Record<Language, string>> & { en: string; es: string };
  languages: string[];
  bilingualStaff: boolean;
  insuranceAccepted: string[];
  eligibility: Partial<Record<Language, string>> & { en: string; es: string };
  servicesOffered: Partial<Record<Language, string[]>> & { en: string[]; es: string[] };
  emergencySupport: boolean;
  rapidArtAvailable: boolean;
  docsNeeded: Partial<Record<Language, string[]>> & { en: string[]; es: string[] };
  transitNotes: Partial<Record<Language, string>> & { en: string; es: string };
  tags: string[];
}

export interface CarePlanItem {
  id: string;
  resourceId: string;
  status: 'planned' | 'in_progress' | 'completed';
  notes: string;
  dateAdded: string;
  appointmentDate?: string;
}

export interface DocumentCheckItem {
  id: string;
  name: Partial<Record<Language, string>> & { en: string; es: string };
  desc: Partial<Record<Language, string>> & { en: string; es: string };
  category: 'residence' | 'income' | 'id' | 'medical' | 'insurance';
  checked: boolean;
  tips: Partial<Record<Language, string>> & { en: string; es: string };
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface SearchGroundingResponse {
  answer: string;
  sources: GroundingSource[];
  webSearchQueries?: string[];
}

export const getLocalized = (
  obj: Partial<Record<Language, string>> | undefined,
  lang: Language,
  fallback = 'en'
): string => {
  if (!obj) return '';
  return obj[lang] || obj[fallback as Language] || obj.en || '';
};

export const getLocalizedList = (
  obj: Partial<Record<Language, string[]>> | undefined,
  lang: Language,
  fallback = 'en'
): string[] => {
  if (!obj) return [];
  return obj[lang] || obj[fallback as Language] || obj.en || [];
};
