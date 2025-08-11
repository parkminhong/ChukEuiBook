import { Language } from './translations';

// Timezone mapping for each language
export const TIMEZONES = {
  ko: 'Asia/Seoul',
  en: 'America/New_York',
  ja: 'Asia/Tokyo',
  zh: 'Asia/Shanghai'
};

// Number and currency formatting
export const formatCurrency = (amount: number, language: Language): string => {
  const locale = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  };

  const currency = {
    ko: '원',
    en: '$',
    ja: '¥',
    zh: '¥'
  };

  const formatted = new Intl.NumberFormat(locale[language]).format(amount);
  return language === 'ko' ? `${formatted}${currency[language]}` : `${currency[language]}${formatted}`;
};

export const formatTickets = (count: number, language: Language): string => {
  const unit = {
    ko: '장',
    en: count === 1 ? 'ticket' : 'tickets',
    ja: '枚',
    zh: '张'
  };
  
  return `${count}${unit[language]}`;
};

export const formatPeople = (count: number, language: Language): string => {
  const unit = {
    ko: '명',
    en: count === 1 ? 'person' : 'people',
    ja: '人',
    zh: '人'
  };
  
  return `${count}${unit[language]}`;
};

export const formatDateTime = (date: Date, language: Language): string => {
  const timezone = TIMEZONES[language];
  
  const locale = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  };

  return new Intl.DateTimeFormat(locale[language], {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const getCurrentTime = (language: Language): Date => {
  // This returns the current time, but the formatting will handle timezone display
  return new Date();
};

// Localized text values
export const getLocalizedSide = (side: string, language: Language): string => {
  if (side === '신랑' || side === 'groom' || side === 'Groom') {
    return {
      ko: '신랑',
      en: 'Groom',
      ja: '新郎',
      zh: '新郎'
    }[language];
  }
  
  if (side === '신부' || side === 'bride' || side === 'Bride') {
    return {
      ko: '신부',
      en: 'Bride',
      ja: '新婦',
      zh: '新娘'
    }[language];
  }
  
  return side;
};

export const getLocalizedRelationship = (relationship: string, language: Language): string => {
  const relationshipMap: Record<string, Record<Language, string>> = {
    '친구': {
      ko: '친구',
      en: 'Friend',
      ja: '友達',
      zh: '朋友'
    },
    '직장': {
      ko: '직장',
      en: 'Work',
      ja: '職場',
      zh: '工作'
    },
    '가족/친척': {
      ko: '가족/친척',
      en: 'Family',
      ja: '家族/親戚',
      zh: '家人/亲戚'
    },
    '지인/기타': {
      ko: '지인/기타',
      en: 'Other',
      ja: 'その他',
      zh: '其他'
    }
  };

  // Find matching relationship
  for (const [key, translations] of Object.entries(relationshipMap)) {
    if (Object.values(translations).includes(relationship) || key === relationship) {
      return translations[language];
    }
  }
  
  return relationship;
};