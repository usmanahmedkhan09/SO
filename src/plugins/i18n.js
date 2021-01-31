import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { dateTimeFormats } from '../locales/formats/dateTimeFormats'
Vue.use(VueI18n)

export function loadLocaleMessages() {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export function checkDefaultLanguage() {
    if(localStorage.getItem('vuex')) {
       return JSON.parse(localStorage.getItem('vuex')).locale
    }
  let matched = null
  let languages = Object.getOwnPropertyNames(loadLocaleMessages())
  languages.forEach(lang => {
    if (lang === navigator.language) {
      matched = lang
    }
  })
  if (!matched) {
    languages.forEach(lang => {
      let languagePartials = navigator.language.split('-')[0]
      if (lang === languagePartials) {
        matched = lang
      }
    })
  }
  if (!matched) {
    languages.forEach(lang => {
      let languagePartials = navigator.language.split('-')[0]
      if (lang.split('-')[0] === languagePartials) {
        matched = lang
      }
    })
  }
  return matched
}
export const languages = Object.getOwnPropertyNames(loadLocaleMessages())

export const selectedLocale = checkDefaultLanguage() || process.env.VUE_APP_I18N_LOCALE || 'en';
export default new VueI18n({
  dateTimeFormats,
  locale: selectedLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})