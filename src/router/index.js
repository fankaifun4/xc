import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index
    }, {
        path: "/listmain",
        name: "listmain",
        component: r => require.ensure([], () => r(require('../pages/listmain.vue')), 'album'),
        children: [{
            path: "album",
            name: "album",
            component: r => require.ensure([], () => r(require('../pages/albumlist.vue')), 'album'),
        }]
    }]
})