import Vue from 'vue'
import Router from 'vue-router'
import mantrl from '@/pages/mantrl'
import pagehome from '@/pages/showImg'
import cropper from '@/pages/cropper'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'pagehome',
        component: pagehome
    }]
})