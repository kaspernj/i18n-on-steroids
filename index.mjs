import {dig, digg} from "diggerize"
import numberable from "numberable"
import strftime from "strftime"

export default class I18nOnSteroids {
  constructor() {
    this.locales = {}
  }

  setLocale(locale) {
    this.locale = locale
  }

  setLocaleOnStrftime() {
    const monthNames = [...Object.values(this.t("date.month_names"))]
    const abbrMonthNames = [...Object.values(this.t("date.abbr_month_names"))]

    monthNames.shift()
    abbrMonthNames.shift()

    const strftimeLocales = {
      days: Object.values(this.t("date.day_names")),
      shortDays: Object.values(this.t("date.abbr_day_names")),
      months: monthNames,
      shortMonths: abbrMonthNames
    }

    this.strftime = strftime.localize(strftimeLocales)
  }

  scanRequireContext(contextLoader) {
    contextLoader.keys().forEach((id) => {
      const content = contextLoader(id)

      this._scanRecursive(content, this.locales, [], id)
    })
  }

  scanObject(object) {
    this._scanRecursive(object, this.locales, [])
  }

  _scanRecursive(data, storage, currentPath, id) {
    for (const key in data) {
      const value = data[key]

      if (typeof value == "object") {
        if (!(key in storage)) {
          storage[key] = {}
        }

        this._scanRecursive(value, storage[key], currentPath.concat([key], id))
      } else {
        if (key in storage) {
          console.error(`Key already found in locales: ${currentPath.join(".")}.${key} '${id}'`, {oldValue: storage[key], newValue: value})
        }

        storage[key] = value
      }
    }
  }

  l(format, date) {
    const formatValue = this.t(format)
    const formattedDate = this.strftime(formatValue, date)

    return formattedDate
  }

  t(key, variables) {
    const path = key.split(".")

    let defaultValue
    let value = dig(this.locales, this.locale, ...path)

    if (variables && "defaultValue" in variables) {
      defaultValue = digg(variables, "defaultValue")
      delete variables.defaultValue
    }

    if (value === undefined) {
      if (defaultValue) {
        return defaultValue
      }

      throw new Error(`Key didn't exist: ${this.locale}.${key}`)
    }

    if (variables) {
      for (const key in variables) {
        value = value.replace(`%{${key}}`, variables[key])
      }
    }

    return value
  }

  toNumber(number) {
    return numberable(number, {
      delimiter: this.t("number.format.delimiter"),
      precision: this.t("number.format.precision"),
      separator: this.t("number.format.separator")
    })
  }
}
