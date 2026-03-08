import { useLang } from './context';
import translations, { type TranslationKey } from './translations';

export function useT() {
  const { lang } = useLang();
  return (key: TranslationKey) => translations[lang][key];
}
