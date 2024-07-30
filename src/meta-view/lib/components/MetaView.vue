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
