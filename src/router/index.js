import Vue from 'vue'
import Router from 'vue-router'
import mantrl from '@/pages/mantrl'
import index from '@/pages/index'
import cropper from '@/pages/cropper'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index
    }]
})