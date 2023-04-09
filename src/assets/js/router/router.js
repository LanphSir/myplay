/* 
    路由
*/
import Vue from 'vue';
import VueRouter from 'vue-router'
//使用
Vue.use(VueRouter)
//导入对应的路由
import discovery from '../../../views/discovery.vue'
import result from '../../../views/results.vue'
import songslist from '../../../views/songslist.vue'
import newsongs from '../../../views/newsongs.vue'
import newmv from '../../../views/newmv.vue'
// import items from './views/list/items.vue'
// import info from './views/info/info.vue'
import mvInfo from '../../../views/info/mvInfo.vue'
import songsInfo from '../../../views/info/songsInfo.vue'
import transfer from '../../../views/transfer/transfer.vue'
//配置路由
const router = new VueRouter({
    routes: [
        {
            //默认
            path: '/',
            redirect: '/discovery'
        }, {
            // 发现音乐
            path: '/discovery',
            component: discovery
        }, {
            // 搜索结果
            path: '/result',
            component: result
        }, {
            // 推荐歌单
            path: '/songslist',
            component: songslist
        }, {
            // 最新音乐
            path: '/newsongs',
            component: newsongs
        },
        {
            // 最新mv
            path: '/newmv',
            component: newmv
        },
        {
            //mv详细信息
            path: '/mvInfo',
            component: mvInfo
        }, {
            // 歌单详细信息
            path: '/songsInfo',
            component: songsInfo
        },
        {
            path:'/transfer',
            component:transfer
        }
    ]
})

//导出
export default router