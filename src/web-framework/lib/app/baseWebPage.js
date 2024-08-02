import BasePage from '../../../appbase/src/app/basePage'
import startWebApp from './startWebApp'

export default class BaseWebPage extends BasePage {
  async start () {
    const { appConfig } = await this.init()
    const module = await this.getModule(appConfig)
    startWebApp({
      module
    })
  }
}
