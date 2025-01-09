import I18nOnSteroids from "../index.mjs"
import {useCallback, useMemo} from "react"
import useLocale from "./use-locale.mjs"

const useI18n = ({namespace}) => {
  const shared = useMemo(() => ({}), [])
  const locale = useLocale()

  shared.locale = locale
  shared.namespace = namespace

  const l = useCallback((format, date, args = {}) => {
    const newArgs = Object.assign({locale: s.m.locale}, args)

    return I18nOnSteroids.getCurrent().l(format, date, newArgs)
  }, [])

  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale: shared.locale}, args)

    if (key.startsWith(".")) {
      key = `${shared.namespace}${key}`
    }

    return I18nOnSteroids.getCurrent().t(key, variables, newArgs)
  }, [])

  return {
    l,
    locale,
    t
  }
}

export default useI18n
