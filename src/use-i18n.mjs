import {useCallback, useMemo} from "react"
import useLocale from "./use-locale.mjs"

const useI18n = ({namespace}) => {
  const shared = useMemo(() => ({}), [])
  const locale = useLocale()

  shared.locale = locale
  shared.namespace = namespace

  const t = useCallback((key, variables, args = {}) => {
    const newArgs = Object.assign({locale: shared.locale}, args)

    if (key.startsWith(".")) {
      key = `${shared.namespace}${key}`
    }

    return I18n.t(key, variables, newArgs)
  }, [])

  return {
    locale,
    t
  }
}

export default useI18n
