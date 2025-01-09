import I18nOnSteroids from "../index.mjs"
import {useCallback} from "react"
import useLocale from "./use-locale.mjs"
import useShape from "set-state-compare/src/use-shape.js"

const useI18n = ({namespace}) => {
  const s = useShape({namespace})
  const locale = useLocale()

  s.updateMeta({locale})

  const l = useCallback((format, date, args = {}) => {
    const newArgs = Object.assign({locale: s.m.locale}, args)

    return I18nOnSteroids.getCurrent().l(format, date, newArgs)
  }, [])

  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale: s.m.locale}, args)

    if (key.startsWith(".")) {
      key = `${s.p.namespace}${key}`
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
