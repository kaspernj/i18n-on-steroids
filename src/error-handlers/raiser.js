export default class ErrorHandlersRaiser {
  /** @param {import("../../index.js").default} i18n */
  constructor(i18n) {
    this.i18n = i18n
  }

  /**
   * @param {{error: Error}} args
   * @returns {never}
   */
  handleError({error}) {
    throw error
  }
}
