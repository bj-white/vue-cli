import Module from './baseModule'
import startWebApp from '../../../web-framework/lib/app/startWebApp'
import applet from '../../../assets/applet.json'

export default class BaseWebPage {
  async start () {
    const { appConfig } = await this.init()
    const module = await this.getModule(appConfig)
    startWebApp({
      module
    })
  }

  async init () {
    return { appConfig: applet }
  }

  async getModule (appConfig) {
    return this.createModule(appConfig)
  }

  createModule (appletConfig) {
    const { config, views } = appletConfig.spec
    return new Module({ config, views })
  }
}
