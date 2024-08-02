import CommonModule from '../../../../web-framework/lib/cores/module'
import { BillListView, BillDetailView, NewAction } from '../../widgets/index'

export default class BillModule extends CommonModule {
  initialize (config) {
    super.initialize(config)
    this.actions.push(
      'fetchDetailInitData'
    )
    this.components = {
      ...this.components,
      BillListView,
      BillDetailView,
      NewAction
    }
  }

  async fetchDetailInitData ({ commit }) {
    const bill = await this.defaultService.new()
    commit('request/initData', { name: 'currentBill', data: bill })
  }
}
