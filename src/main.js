import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 动画库
import "animate.css";

// vant-ui
import Vant from 'vant';
import "vant/lib/index.less";
Vue.use(Vant);

// vue-router
import router from '@/router'

// vuex
import store from './store'
Vue.prototype.$store = store

// import vConsole from 'vconsole';
// new vConsole();

/**
 * 聊天板块
 */
import "@/chat/styles/vant.scss";
import chatApi from '@/chat/utils/request'
Vue.prototype.$chatApi = chatApi
Vue.prototype.$bus = new Vue();
import ChatList from '@/chat/components/ChatList'
import ChatEmpty from '@/chat/components/ChatEmpty'
import ChatNav from '@/chat/components/ChatNav'
Vue.component('ChatList', ChatList)
Vue.component('ChatEmpty', ChatEmpty)
Vue.component('ChatNav', ChatNav)
import { Lazyload } from 'vant';
Vue.use(Lazyload);
import longtapDirective from '@/chat/directives/longtap'
import scaleDirective from '@/chat/directives/scale';
import copyDirective from '@/chat/directives/copy';
import qrcodeDirective from '@/chat/directives/qrcode';
Vue.directive('scale', scaleDirective);
Vue.directive('copy', copyDirective);
Vue.directive('qrcode', qrcodeDirective);
Vue.directive('longtap', longtapDirective)
import chatMixin from '@/chat/mixins/index'
Vue.mixin(chatMixin)
import '@/chat/utils/filter';
import { getLang } from './chat/config';

/**
 * 国际化
 */
import { messages } from '@/locale'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: getLang(),
  messages
})
// 抛出给js文件使用的国际化翻译方法
export function t(key){
  return i18n.tc(key)
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
