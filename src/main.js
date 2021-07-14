import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axiosOrigin from 'axios'
import 'cesium/Widgets/widgets.css'
import dataV from '@jiaminghi/data-view'

Vue.use(dataV) // 将自动注册所有组件为全局组件
Vue.config.productionTip = false

function getServerConfig() {
  return new Promise((resolve, reject) => {
    axiosOrigin
      .get('./serverConfig.json')
      .then((result) => {
        let config = result.data
        console.log(config)
        for (let key in config) {
          Vue.prototype[`$${key}`] = config[key]
        }
        /*  if (config.baseUrl) {
          axios.defaults.baseURL = config.baseUrl
        } */
        resolve()
      })
      .catch(() => {
        reject()
      })
  })
}
async function main() {
  await getServerConfig()
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app')
}

main()
