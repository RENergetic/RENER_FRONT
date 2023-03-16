import { createI18n } from "vue-i18n";

import en from "../assets/locales/EN-en";

export const allowedLocales = {
  pl: "PL-pl",
  es: "ES-es",
  en: "EN-en",
  de: "DE-de",
  be: "BE-be",
  //TODO: make this list dynamic - based on server response
};
const loadedLocales = new Set();
loadedLocales.add("en");

const getNavigatorLanguage = () => {
  try {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0].split("-")[0].toLowerCase();
    } else {
      return navigator.userLanguage || navigator.language || navigator.browserLanguage || process.env.VUE_APP_I18N_LOCALE || "en";
    }
  } catch (error) {
    console.error(error);
    return process.env.VUE_APP_I18N_LOCALE || "en";
  }
};
var localeCode = getNavigatorLanguage();
console.debug(`detected language: ${localeCode}`);
// const messages = { pl: pl, en: en };
if (!(localeCode in allowedLocales)) {
  console.warn(`Locale not supported ${localeCode}`);
  localeCode = process.env.VUE_APP_I18N_LOCALE || "en";
}
localeCode = "pl";

const i18n = createI18n({
  locale: localeCode,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  defaultLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: { en: en },
});

export async function setLocale(localeCode) {
  if (loadedLocales.has(localeCode)) {
    i18n.global.locale = localeCode;
    return;
  }
  if (localeCode == null) {
    i18n.global.locale = "en";
  } else {
    if (!loadedLocales.has(localeCode)) {
      try {
        let localeResource = await import(`@/assets/locales/${allowedLocales[localeCode]}`);
        i18n.global.setLocaleMessage(localeCode, localeResource.default);
        loadedLocales.add(localeCode);
        i18n.global.locale = localeCode;
        console.info(`locale changed to: ${i18n.global.locale}`);
      } catch (error) {
        console.error(`Locale not found ${localeCode}:${allowedLocales[localeCode]}. ${error}`);
      }
    }
  }
}
// console.info(i18n.global);
await setLocale(localeCode);

export default i18n;
