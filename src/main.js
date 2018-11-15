// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },

  template: '<App :broker="config.broker" :topics="config.topics" />',
  computed: {
    config () {
      return window.config
    }
  }
})
