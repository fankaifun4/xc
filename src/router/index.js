import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index
    },{
        path: '/mylist',
        name: 'mylist',
      	component: r => require.ensure([], () => r(require('../pages/getmyalbum.vue')), 'album')
    }]
})