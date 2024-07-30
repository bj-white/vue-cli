import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default ( { Router }) => {
  console.log(Router, '------------------------')
  return Router
}
