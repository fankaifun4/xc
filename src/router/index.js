import Vue from 'vue'
import Router from 'vue-router'
import pageHome from '@/pages/index'
import upload from '@/pages/upload'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'pagehome',
        component: pageHome
    }, {
        path: "/upload",
        name: "upload",
        component: upload
    }]
})