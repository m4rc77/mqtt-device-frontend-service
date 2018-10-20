// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  // template: '<App broker="' + window.config.broker + '" topics=' + window.config.topics + ' />',
  // propsData: {
  //   broker: window.config.broker,
  //   topics: window.config.topics
  // },
  // data: {
  //   broker: window.config.broker,
  //   topics: window.config.topics
  // },
  // TODO is this really the only option???
  render: h => h(App, {props: {broker: window.config.broker, topics: window.config.topics}})
})
