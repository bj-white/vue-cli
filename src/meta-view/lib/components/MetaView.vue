<template>
  <div>sadad</div>
</template>

<script>
export default {
  props: ['config', 'context', 'scope'],
  mounted () {
    console.log(this.config, this.context, this.scope, '===============')
  }
}
</script>
