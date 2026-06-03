import Vue from 'vue'
import Router from 'vue-router'
import chatRoutes from '@/chat/router'
Vue.use(Router)

const options = {
    mode: 'hash',
    routes: chatRoutes,
    scrollBehavior() {
        return { x: 0, y: 0 } // 每次路由切换都滚动到顶部
    }
}
// if(publicPath != '/')options['base'] = publicPath

const router = new Router(options)

export default router;