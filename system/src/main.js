import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import moment from 'moment'
import {Base64} from 'js-base64'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.prototype.api = 'http://127.0.0.1:3000/v1'
Vue.prototype.moment = moment
axios.defaults.baseURL = 'http://127.0.0.1:3000/v1'
//token令牌
axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem("token");
  const base64 = Base64.encode(token+":")
  config.headers.Authorization = 'Basic ' + base64
  return config
})

Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
