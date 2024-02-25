import useLocale from "./use-locale.mjs"
import useShape from "set-state-compare/src/use-callback.js"

const useI18n = ({namespace}) => {
  const s = useShape({namespace})
  const locale = useLocale()

  s.updateMeta({locale})

  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale: s.m.locale}, args)

    return I18n.t(`${s.p.namespace}.${key}`, variables, newArgs)
  }, [])

  return {
    locale: s.s.locale,
    t
  }
}

export default useI18n
