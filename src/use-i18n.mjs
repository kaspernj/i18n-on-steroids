import {useCallback} from "react"
import useLocale from "./use-locale.mjs"
import useShape from "set-state-compare/src/use-shape.js"

const useI18n = ({namespace}) => {
  const s = useShape({namespace})
  const locale = useLocale()

  s.updateMeta({locale})

  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale: s.m.locale}, args)

    if (key.startsWith(".")) {
      key = `${s.p.namespace}${key}`
    }

    return I18n.t(key, variables, newArgs)
  }, [])

  return {
    locale,
    t
  }
}

export default useI18n
