// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/store.js'
import VConsole from 'vconsole'
import '@/libs/flexlib.js'
import "@/style/comm.scss"
window.vConsole = new VConsole();
Vue.prototype.$http = axios
Vue.config.productionTip = true
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})