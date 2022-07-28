import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import 'moment/locale/zh-cn'//中文
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
