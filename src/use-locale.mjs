import events from "./events.mjs"
import {useEffect, useState} from "react"

const useLocale = () => {
  const [locale, setLocale] = useState(I18n.locale)
  const updateLocale = useCallback(() => {
    setLocale(I18n.locale)
  }, [])

  useEffect(() => {
    events.addListener("localeChanged", updateLocale)

    return () => {
      events.removeListener("localeChanged", updateLocale)
    }
  }, [])

  return locale
}

export default useLocale
