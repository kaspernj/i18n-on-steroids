export default class ErrorHandlersRaiser {
  constructor(i18n) {
    this.i18n = i18n
  }

  /**
   * @param {{error: Error, key: string, path: string[], variables: Record<string, any> | undefined}} args
   */
  handleError({error}) {
    throw error
  }
}
