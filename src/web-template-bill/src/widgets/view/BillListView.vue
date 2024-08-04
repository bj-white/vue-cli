<template>
  <div class="bill-list-view">
    billListView
    <!-- <slot name="actionZone"></slot>
    <slot name="bodyContainer"></slot> -->
  </div>
</template>

<script>
export default {
  name: 'BillListView',
  inject: {
    conextProvider: {
      default: {}
    }
  },
  data () {
    return {}
  },
  mounted () {
    // console.log('this===================', this.conextProvider.parentContext.ref('NewAction-a0f18344a1')())
  }
}
</script>
