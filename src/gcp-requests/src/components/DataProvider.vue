<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers('request')
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    initialData: {
      type: [Object, Array]
    },
    queryDef: {
      type: [Object, Array]
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      isJumpFirst: true
    }
  },
  computed: {
    preload () {
      const { preload } = this.options
      return preload === undefined || preload
    },
    autoLoad () {
      const { autoLoad } = this.options
      return autoLoad === undefined || autoLoad
    }
  },
  created () {
    this.init()
    this.isFirstLoad = true
    this.loadData()
  },
  methods: {
    ...mapMutations(['saveQuery', 'initData']),
    async loadData (params) {
      if (!this.preload && this.isJumpFirst) {
        if (this.name && this.queryDef) {
          this.saveQuery({
            name: this.name,
            query: this.queryDef
          })
        }
        this.isJumpFirst = false
        return
      }
      if (!this.queryDef) {
        return
      }
      if (this.options.paginated) {
        this.loadPageData(params)
      } else if (this.options.infinite) {
        this.loadInfiniteData(params)
      } else {
        this.defaultLoadData()
      }
      this.isFirstLoad = false
    },
    loadPageData (params) {},
    loadInfiniteData (params) {},
    defaultLoadData () {
      console.log(7777)
    },
    init () {
      if (this.name && this.queryDef) {
        this.saveQuery({
          name: this.name,
          query: this.queryDef
        })
      }
      if (this.initialData) {
        this.initData({
          name: this.name,
          data: JSON.parse(JSON.stringify(this.initialData))
        })
      }
    }
  },
  watch: {
    queryDef () {

    }
  }
}
</script>
