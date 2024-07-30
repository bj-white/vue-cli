<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
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
