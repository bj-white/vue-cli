<template>
  <div>
    <div v-for="(item, key) in dataProvider.model.ejxb" :key="key">
      <input type="text" v-model="item.dj">
      <input type="text" v-model="item.sl">
      <input type="text" v-model="item.zj">
    </div>
    <button @click="handleClick">switch me</button>
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
    dataviewPropHook: {
      default: {}
    },
    conextProvider: {
      default: {}
    }
  },
  created () {},
  methods: {
    handleClick () {
      this.dataProvider.model.toggleReadonly(false)
    }
  }
}
</script>
