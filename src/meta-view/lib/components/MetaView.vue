<script>
import ResolverChain from '../resolvers/ResolverChain'
import ComponentResolver from '../resolvers/ComponentResolver'
import DataSourceResolver from '../resolvers/DataSourceResolver'
import ContextValueResolver from '../resolvers/ContextValueResolver'
import ExprResolver from '../resolvers/ExprResolver'
import StringSlotContentResolver from '../resolvers/StringSlotContentResolver'
import { evalBindPropValue } from '../properties'
import { hasOwnProperty } from '../../../gcp-utils/lib/assert'
export default {
  name: 'MetaView',
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
    components: Object,
    dataSourceDefs: {
      type: Object
    }
  },
  data () {
    return {}
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
      const id = this.getId(desc, scope)
      const props = this.evalPropValues(desc.props, scope)
      const events = this.evalPropValues(desc.events, scope)
      if (!this.getVisible(props, scope)) {
        return ''
      }
      const scopedSlots = this.getScopedSlots(h, desc, scope)
      return h(desc.type, {
        props,
        on: events,
        scopedSlots,
        ref: id
      })
    },
    getVisible (props, scope) {
      const visible = props.visible
      if (!hasOwnProperty(props, 'visible')) {
        return true
      }
      if (typeof visible === 'function') {
        return !!visible(scope)
      } else {
        return !!visible
      }
    },
    getId (desc, scope) {
      const id = desc.id
      if (!id) {
        return
      }
      if (typeof id === 'function') {
        return id(scope)
      } else {
        return id
      }
    },
    evalPropValues (target, scope) {
      if (!target) {
        console.log('todo=============')
      }
      const result = {}
      for (const key in target) {
        const propValue = target[key]
        if (!propValue) {
          result[key] = propValue
          continue
        }
        if (key.startsWith(':')) {
          const propName = key.substring(1)
          result[propName] = evalBindPropValue(propValue, scope)
        } else {
          result[key] = propValue
        }
      }
      return result
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
        const mergedScope = { ...parentScope, ...scope }
        if (typeof slotVal === 'function') {
          return this.renderSlotComponent(h, slotVal(), mergedScope)
        } else {
          return this.renderSlotComponent(h, slotVal, mergedScope)
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
      // 把每个控件元数据的字符串type变成了组件（component）
      resolverChain.addResolver(new ComponentResolver(components, this.getConfig))
      resolverChain.addResolver(new DataSourceResolver(this.dataSourceDefs))
      resolverChain.addResolver(new ContextValueResolver(this.context))
      resolverChain.addResolver(new ExprResolver())
      resolverChain.addResolver(new StringSlotContentResolver())
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
