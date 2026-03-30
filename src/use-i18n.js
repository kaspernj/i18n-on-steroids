import I18nOnSteroids from "../index.js"
import {useCallback} from "react"
import useLocale from "./use-locale.js"

/** @typedef {{namespace: string}} UseI18nArgs */

/**
 * @param {UseI18nArgs} args
 * @returns {{
 *   l: (format: string, date: Date, args?: object) => string,
 *   locale: string,
 *   strftime: (format: string, date: Date) => string,
 *   t: (key: string, variables?: object, args?: object) => string
 * }}
 */
const useI18n = ({namespace}) => {
  const locale = useLocale()

  /** @type {(format: string, date: Date, args?: {locale?: string}) => string} */
  const l = useCallback((format, date, args = {}) => {
    const newArgs = Object.assign({locale}, args)

    return I18nOnSteroids.getCurrent().l(format, date, newArgs)
  }, [locale])

  /** @type {(format: string, date: Date) => string} */
  const strftime = useCallback((format, date) => I18nOnSteroids.getCurrent().strftime(format, date), [])

  /** @type {(key: string, variables?: Record<string, any>, args?: {default?: string, locale?: string}) => string} */
  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale}, args)
    let translationKey = key

    if (translationKey.startsWith(".")) {
      translationKey = `${namespace}${translationKey}`
    }

    return I18nOnSteroids.getCurrent().t(translationKey, variables, newArgs)
  }, [locale, namespace])

  return {
    l,
    locale,
    strftime,
    t
  }
}

export default useI18n
