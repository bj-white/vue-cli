<template>
  <div>
    <DataContext :context="context">
      <router-view></router-view>
    </DataContext>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import BillDetailView from '../../../web-template-bill/src/widgets/view/BillDetailView.vue'
import DataContext from '../../../gcp-forms/lib/layout/DataContext.vue'
export default {
  components: {
    // BillDetailView,
    DataContext
  },
  props: {
    context: Object
  },
  data () {
    return {
      docType: {},
      render: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions(['bootstrap']),
    async init () {
      await this.bootstrap()
      this.render = true
    }
  }
}
</script>
