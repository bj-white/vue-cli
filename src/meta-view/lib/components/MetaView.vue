<script>
import ResolverChain from '../resolvers/ResolverChain'
import ComponentResolver from '../resolvers/ComponentResolver'
export default {
  props: {
    config: {
      type: [Object, Function],
      required: true
    },
    scope: {
      type: Object,
      defaultValue: {}
    },
    context: {
      type: Object,
      defaultValue: {}
    },
    components: Object
  },
  computed: {
    resolvedConfig () {
      const viewConfig = this.getConfig()
      this.resolverChain.resolve(viewConfig)
      console.log('====================1', viewConfig)
      return viewConfig
    },
    rootScope () {
      const ref = this.ref.bind(this)
      const context = Object.assign(this.context, { ref })
      return {
        store: this.$store,
        route: this.$route,
        ref,
        context,
        ...this.scope
      }
    }
  },
  created () {
    this.resolverChain = this.initResolverChain()
  },
  methods: {
    renderByDesc (h, desc, scope) {
      if (desc.text) {
        return h(desc.type, desc.text)
      }
      const scopedSlots = this.getScopedSlots(h, desc, scope)
      return h(desc.type, {
        scopedSlots
      })
    },
    getScopedSlots (h, desc, scope) {
      const result = {}
      if (desc.content) {
        console.log('todo=============')
      }
      if (desc.slots) {
        Object.keys(desc.slots).forEach(slotName => {
          if (desc.slots[slotName]) {
            result[slotName] = this.getSlotFn(h, desc.slots[slotName], scope)
          }
        })
      }
      return result
    },
    getSlotFn (h, slotVal, parentScope) {
      return scope => {
        if (typeof slotVal === 'function') {
          return this.renderSlotComponent(h, slotVal(), scope)
        } else {
          return this.renderSlotComponent(h, slotVal, scope)
        }
      }
    },
    renderSlotComponent (h, desc, scope) {
      if (Array.isArray(desc)) {
        return desc.map(descItem => {
          return this.renderByDesc(h, descItem, scope)
        })
      } else {
        console.log('todo===========')
      }
    },
    ref (id) {
      return () => this.$refs[id]
    },
    initResolverChain () {
      const resolverChain = new ResolverChain()
      let components = this.components
      if (!components && this.context.components) {
        components = this.context.components
      }
      resolverChain.addResolver(new ComponentResolver(components, this.getConfig))
      return resolverChain
    },
    getConfig () {
      return typeof this.config === 'function' ? this.config() : this.config
    }
  },
  render (h) {
    console.log('resolvedConfig=================', this.resolvedConfig, this.rootScope)
    return this.renderByDesc(h, this.resolvedConfig, this.rootScope)
  }
}
</script>
