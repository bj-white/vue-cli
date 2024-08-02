export default class BasePage {
  constructor () {
    this.app = null
  }

  async getModule (appConfig) {
    return this.createModule(appConfig)
  }
}
