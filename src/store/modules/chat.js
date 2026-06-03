/*
 * @Description: 
 * @Version: 1.0
 * @Author: JCY
 * @Date: 2025-04-29 09:23:25
 */
/*
 * @Description: 
 * @Version: 1.0
 * @Author: JCY
 * @Date: 2025-04-29 09:23:25
 */
import Socket from "@/chat/utils/socket";
import { socketUrl, getToken } from '@/chat/config'
import { Toast } from 'vant'
import Vue from "vue";
import router from "@/router";

const state = {
    socket: null,
    isConnected: false
}
  
const mutations = {
    SET_CONNECTION_STATUS(state, status) {
        state.isConnected = status
    },
    SET_SOCKET(state, socket) {
        state.socket = socket
    }
}
  
const actions = {
    initSocket({ commit, dispatch }) {
        if (state.socket) return
        
        const token = getToken()
        if (!token) return
        
        const currentPath = router.currentRoute.path
        if(currentPath==='/tabbar/chat' || currentPath.startsWith('/friend/')  || currentPath.startsWith('/group/')){
            Toast.loading({
                message: '连接中...',
                forbidClick: true,
                duration: 0
            })
        }
        
        
        const wsUrl = socketUrl + token
        
        const socket = new Socket(wsUrl, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            heartbeatInterval: 5000
        })
        
        // 连接成功
        socket.on('connect', () => {
            commit('SET_CONNECTION_STATUS', true)
            Toast.clear()
        })
        
        // 连接断开
        socket.on('disconnect', (event) => {
            commit('SET_CONNECTION_STATUS', false)
            // 只有在非主动断开时才显示重连提示
            if (event.code !== 4000) {
                const nowPath = router.currentRoute.path
                if(nowPath==='/tabbar/chat' || nowPath.startsWith('/friend/')  || nowPath.startsWith('/group/')){
                    Toast.loading({
                        message: '重连中...',
                        forbidClick: true,
                        duration: 0
                    })
                }
            }
        })
        
        // 重连失败
        socket.on('reconnect_failed', () => {
            Toast.clear()
        })
        
        // 连接错误
        socket.on('error', (error) => {
            console.error('Socket error:', error)
            Toast.clear()
        })
        
        // 监听聊天消息
        socket.on('talk', (data) => {
            const path = router.currentRoute.path
            if(path==='/' || path==='/tabbar/chat' || path.startsWith('/friend/')  || path.startsWith('/group/')){
                // 在会话列表或者聊天页面时，刷新消息
                Vue.prototype.$bus.$emit('talk', data.content)
            }else{
                // 在非聊天页面，通知消息
                dispatch('noticeNewMessage', data.content)
            }
        })
        
        // 监听撤回消息
        socket.on('revoke', (data) => {
            const path = router.currentRoute.path
            if(path==='/' || path==='/tabbar/chat' || path.startsWith('/friend/')  || path.startsWith('/group/')){
                // 在会话列表或者聊天页面时，刷新消息
                Vue.prototype.$bus.$emit('revoke', data.content)
            }
        })
        
        // 保存 socket 实例
        commit('SET_SOCKET', socket)
        
        // 开始连接
        socket.connect()
    },
    
    disconnect({ commit, state }) {
        if (state.socket) {
            state.socket.disconnect()
            commit('SET_SOCKET', null)
        }
    },

    // 弹窗通知新消息
    noticeNewMessage(store,message){
        Vue.prototype.$bus.$emit('notice', message)
    }
}
  
export default {
    namespaced: true,
    state,
    mutations,
    actions
}