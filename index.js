import events from "./src/events.js"
import {dig, digg} from "diggerize/build/index.js"
import numberable from "numberable"
import Raiser from "./src/error-handlers/raiser.js"
import strftime from "strftime"

/** @typedef {{fallbacks?: Record<string, string[]>}} I18nOnSteroidsArgs */
/**
 * @typedef {object} ErrorHandlerArgs
 * @property {Error} error
 * @property {string} [key]
 * @property {string[]} [path]
 * @property {Record<string, any>} [variables]
 */
/**
 * @typedef {{handleError: (args: ErrorHandlerArgs) => any}} ErrorHandler
 */
/**
 * @typedef {{current: I18nOnSteroids | null}} GlobalI18nOnSteroids
 */

/** @type {typeof globalThis & {i18nOnSteroids?: GlobalI18nOnSteroids}} */
const globalObject = globalThis

if (!globalObject.i18nOnSteroids) globalObject.i18nOnSteroids = {current: null}

export default class I18nOnSteroids {
  /** @returns {I18nOnSteroids} */
  static getCurrent() {
    if (!globalObject.i18nOnSteroids?.current) throw new Error("A current instance hasn't been set")

    return globalObject.i18nOnSteroids.current
  }

  /** @param {I18nOnSteroids} i18n */
  static setCurrent(i18n) {
    globalObject.i18nOnSteroids = {current: i18n}
  }

  /** @param {I18nOnSteroidsArgs} [args] */
  constructor(args) {
    /** @type {ErrorHandler} */
    this.errorHandler = new Raiser(this)
    /** @type {Record<string, any>} */
    this.locales = {}
    /** @type {string | undefined} */
    this.locale = undefined
    /** @type {(format: string, date: Date) => string} */
    this.strftime = strftime

    if (args?.fallbacks) {
      this.fallbacks = args.fallbacks
    } else {
      this.fallbacks = {}
    }
  }

  /** @param {ErrorHandler} errorHandler */
  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler
  }

  /** @param {string} locale */
  setLocale(locale) {
    this.locale = locale
    events.emit("localeChanged")
  }

  /** @returns {void} */
  setLocaleOnStrftime() {
    const monthNames = [...Object.values(this.t("date.month_names"))]
    const abbrMonthNames = [...Object.values(this.t("date.abbr_month_names"))]

    monthNames.shift()
    abbrMonthNames.shift()

    /** @type {import("strftime").Locale} */
    const strftimeLocales = {
      days: Object.values(this.t("date.day_names")),
      formats: {},
      shortDays: Object.values(this.t("date.abbr_day_names")),
      months: monthNames,
      shortMonths: abbrMonthNames
    }

    this.strftime = strftime.localize(strftimeLocales)
  }

  /** @param {{keys: () => string[], (id: string): object}} contextLoader */
  scanRequireContext(contextLoader) {
    contextLoader.keys().forEach((id) => {
      const content = contextLoader(id)

      this._scanRecursive(content, this.locales, [], id)
    })
  }

  /** @param {object} object */
  scanObject(object) {
    this._scanRecursive(object, this.locales, [])
  }

  /**
   * @param {Record<string, any>} data
   * @param {Record<string, any>} storage
   * @param {string[]} currentPath
   * @param {string} [id]
   * @returns {void}
   */
  _scanRecursive(data, storage, currentPath, id) {
    for (const key in data) {
      const value = data[key]

      if (typeof value == "object") {
        if (!(key in storage)) {
          storage[key] = {}
        }

        this._scanRecursive(value, storage[key], id ? currentPath.concat([key], id) : currentPath.concat(key))
      } else {
        if (key in storage) {
          console.error(`Key already found in locales: ${currentPath.join(".")}.${key} '${id}'`, {oldValue: storage[key], newValue: value})
        }

        storage[key] = value
      }
    }
  }

  /**
   * @param {string} format
   * @param {Date} date
   * @param {{locale?: string}} [args]
   * @returns {string}
   */
  l(format, date, args) {
    const formatValue = this.t(format, undefined, args)
    const formattedDate = this.strftime(formatValue, date)

    return formattedDate
  }

  /**
   * @param {string} key
   * @param {Record<string, any>} [variables]
   * @param {{default?: string, locale?: string}} [args]
   * @returns {string}
   */
  t(key, variables, args) {
    const locale = args?.locale || this.locale || ""
    const path = key.split(".")
    const localesToTry = this.fallbacks[locale] || [locale]
    let defaultValue, value

    for (const locale of localesToTry) {
      value = this._lookup(locale, path)

      if (value) {
        break
      }
    }

    if (variables && "defaultValue" in variables) {
      defaultValue = digg(variables, "defaultValue")
      delete variables.defaultValue
    }

    if (value === undefined) {
      if (args?.default) {
        value = args.default
      } else if (defaultValue) {
        value = defaultValue
      }
    }

    if (value) {
      return this.insertVariables(value, variables)
    }

    const error = Error(`Key didn't exist: ${locale}.${key}`)

    return this.errorHandler.handleError({error, key, path, variables})
  }

  /**
   * @param {string} value
   * @param {Record<string, any>} [variables]
   * @returns {string}
   */
  insertVariables(value, variables) {
    if (variables) {
      for (const key in variables) {
        value = value.replace(`%{${key}}`, variables[key])
      }
    }

    return value
  }

  /**
   * @param {string} locale
   * @param {string[]} path
   * @returns {any}
   */
  _lookup = (locale, path) => dig(this.locales, locale, ...path)

  /**
   * @param {number} number
   * @returns {string}
   */
  toNumber(number) {
    return numberable(number, {
      delimiter: this.t("number.format.delimiter"),
      precision: this.t("number.format.precision"),
      separator: this.t("number.format.separator")
    })
  }
}
