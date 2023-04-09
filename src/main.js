import Vue from 'vue'
import App from './App.vue'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
//初始化 element-ui 插件
Vue.use(ElementUI)
// 导入全局样式表
import './assets/css/index.css'
//  引入全局js
import indexjs from './assets/js/index.js'
// 初始化index.js
Vue.prototype.$indexjs=indexjs 
// 引入bus总线
import busjs from "./assets/js/bus.js"
// 初始化bus.js
window.$Bus=busjs
// 引入路由，
import router from './assets/js/router/router.js';

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router
}).$mount('#app')
