import { BaseModule } from '../exposes/appbase'
import { StatefulFormTable } from '../../../gcp-forms/lib/index'

export default class CommonModule extends BaseModule {
  initialize (config) {
    super.initialize(config)
    this.components = {
      StatefulFormTable
    }
  }
}
