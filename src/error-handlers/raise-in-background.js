// Raises an error outside the normal thread and returns the last part of the key as a string
export default class ErrorHandlersRaiseInBackground {
  /** @param {import("../../index.js").default} i18n */
  constructor(i18n) {
    this.i18n = i18n
  }

  /**
   * @param {{error: Error, path: string[]}} args
   * @returns {string}
   */
  handleError({error, path}) {
    setTimeout(
      () => {
        throw error
      },
      0
    )

    // Return the last part of the path as a string
    return path[path.length - 1]
  }
}
