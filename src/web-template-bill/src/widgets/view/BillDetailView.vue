<template>
  <DataProvider
    name="currentBill"
    :query-def="queryDef"
    :options="{ autoLoad: false, preload: false }">
    <DataViewPropHookProvider v-if="currentBill" :dataview-prop-hook="dataviewPropHook">
      <DataContext :data="currentBill" :readonly="readonly">
        <HelloWorld />
        <button @click="readonly = !readonly">click me</button>
      </DataContext>
    </DataViewPropHookProvider>
  </DataProvider>
</template>

<script>
import DataProvider from '../../../../gcp-requests/src/components/DataProvider.vue'
import HelloWorld from '../../../../components/HelloWorld.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    DataProvider,
    HelloWorld,
  },
  data () {
    return {
      dataviewPropHook: {
        name: 'hello-world'
      },
      data: {
        name: 'aaa'
      },
      readonly: true
    }
  },
  computed: {
    currentBill () {
      return this.$store.getters['request/dataByName']('currentBill')
    },
    queryDef () {
      return {
        name: '111'
      }
    }
  },
  async created () {
    await this.init()
  },
  methods: {
    ...mapActions(['fetchDetailInitData']),
    async init () {
      await this.fetchDetailInitData()
    },
    handleClick () {
      this.currentBill.name = '111111'
    }
  }
}
</script>
