import events from "./events.js"
import I18nOnSteroids from "../index.js"
import {useCallback, useEffect, useState} from "react"

/** @returns {string} */
const useLocale = () => {
  const [locale, setLocale] = useState(I18nOnSteroids.getCurrent().locale || "")
  const updateLocale = useCallback(() => {
    setLocale(I18nOnSteroids.getCurrent().locale || "")
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
