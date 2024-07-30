<template>
  <div>
    <slot></slot>
    {{ readonly }}
  </div>
</template>

<script>
export default {
  provide () {
    const provider = {}
    if (this.data !== undefined) {
      provider.dataProvider = this.innerData
    }
    if (this.readonly !== undefined) {
      provider.readonlyProvider = this.innerReadonly
    }
    if (this.context !== undefined) {
      provider.conextProvider = this.innerContext
    }
    return provider
  },
  props: {
    data: {
      type: [Object, Array]
    },
    context: {
      type: Object
    },
    readonly: {
      type: [Boolean, Function],
      default () {
        return undefined
      }
    }
  },
  data () {
    return {
      innerData: {
        model: this.data
      },
      innerReadonly: {
        parentReadonly: this.readonly
      },
      innerContext: {
        parentContext: this.context
      }
    }
  },
  computed: {
    isReadonly () {
      if (this.readonly && typeof this.readonly === 'function') {
        return this.readonly(this.data)
      }
      return this.readonly
    }
  },
  watch: {
    data: {
      handler (val) {
        this.innerData.model = val
      },
      immediate: true
    },
    isReadonly: {
      handler (val) {
        this.innerReadonly.parentReadonly = val
      },
      immediate: true
    },
    context: {
      handler (val) {
        this.innerContext.parentContext = val
      },
      immediate: true
    }
  }
}
</script>
