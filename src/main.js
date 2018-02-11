// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store.js'
import VConsole from 'vconsole'
var wx = require('weixin-js-sdk')
import '@/libs/flexlib.js'
import "@/style/comm.scss"
window.vConsole = new VConsole();

Vue.config.productionTip = true
    /* eslint-disable no-new */



//config wx-js-sdk   

Vue.prototype.initSdk = (target, callback) => {
    wx.config({
        debug: false,
        appId: target.appId,
        timestamp: target.timestamp,
        nonceStr: target.nonceStr,
        signature: target.signature,
        jsApiList: [
            'checkJsApi',
            'openLocation',
            'getLocation',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            "chooseImage",
            "previewImage",
            "uploadImage"
        ]
    })

    wx.checkJsApi({
        jsApiList: [
            'checkJsApi',
            'openLocation',
            'getLocation',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            "chooseImage",
            "previewImage",
            "uploadImage"
        ],
        success(res) {

        }
    })
    callback(wx)

    // return wx
}

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})