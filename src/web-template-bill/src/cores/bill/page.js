import CommonPage from '../../../../web-framework/lib/cores/page'
import BillModule from './module'

export default class BillPage extends CommonPage {
  createModule (appletConfig) {
    const { config, views } = appletConfig.spec
    return new BillModule({ config, views })
  }
}
