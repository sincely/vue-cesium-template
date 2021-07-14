import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axiosOrigin from 'axios'

import './core/ant-design-vue' // 按需引入ant-design-vue组件
import 'ant-design-vue/dist/antd.css' //ant-design-vue组件样式
import './core/element-ui' // 按需引入element-ui组件
import 'element-ui/lib/theme-chalk/index.css' // element-ui组件样式

import 'cesium/Widgets/widgets.css'

import dataV from '@jiaminghi/data-view' // 科技风格边框
import './global.less' // 全局样式

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
