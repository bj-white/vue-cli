<template>
  <div>
    <DataContext v-if="render" :context="context">
      <router-view></router-view>
    </DataContext>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  components: {},
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
