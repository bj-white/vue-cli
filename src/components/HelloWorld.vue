<template>
  <div>
    <div v-for="(item, key) in dataProvider.model.ejxb" :key="key">
      <input type="text" v-model="item.dj">
      <input type="text" v-model="item.sl">
      <input type="text" v-model="item.zj">
    </div>
    <button @click="handleClick" ref="aaaa">switch me</button>
  </div>
</template>

<script>
export default {
  inject: {
    dataProvider: {
      default: {
        model: null
      }
    },
    readonlyProvider: {
      default: {}
    },
    conextProvider: {
      default: {}
    },
    dataviewPropHook: {
      default: {}
    },
  },
  created () {
    console.log('dataProvider==========', this.dataProvider)
    console.log('readonlyProvider==========', this.readonlyProvider)
    console.log('conextProvider==========', this.conextProvider)
    console.log('dataviewPropHook==========', this.dataviewPropHook)
  },
  mounted () {
    console.log(this.conextProvider.parentContext.ref('aaaa')())
    console.log(this.$refs['aaaa'])
  },
  methods: {
    handleClick () {
      this.dataProvider.model.toggleReadonly(false)
    }
  }
}
</script>
