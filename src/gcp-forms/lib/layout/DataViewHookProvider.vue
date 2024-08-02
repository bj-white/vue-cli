<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DataViewPropHookProvider',
  provide () {
    return {
      dataviewPropHook: this.dataviewPropHook
    }
  },
  props: {
    dataviewPropHook: {
      type: Object
    }
  }
}
</script>
