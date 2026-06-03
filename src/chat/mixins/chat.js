import { ChatText, ChatBotbar, ChatVoice, ChatImage, ChatVideo, ChatGift, NoticeGift, NoticeRevoke, NoticeChange, GiftPopup, ChatSheet } from '@/chat/views/chat/components'
import { getUserId } from '@/chat/config'
import { getFileType, throttle } from '@/chat/utils'
import { t } from '@/main'
export default {
    components: {
        ChatBotbar,
        ChatText,
        ChatVoice,
        ChatImage,
        ChatVideo,
        ChatGift,
        NoticeGift,
        NoticeRevoke,
        NoticeChange,
        GiftPopup,
        ChatSheet
    },
    data(){
        return {
            talkId:'', // 会话id
            // 接收方或群信息
            receiveInfo:{
                id: '',
                avatar: '',
                nickname: '',
                is_silence: false,
                role: 1
            },
            // 自己的信息
            selfInfo: {
                id: ''
            },
            // 分页
            loading: false,
            finished: false,
            list: [],
            limit: 0,
            record_id: '0',
            // 富文本实例
            container: null,
            // 音频
            currentAudio: null,
            currentMessageId: null,
            // 气泡弹窗参数
            sheetOption:{},

            // 方法
            getFileType
        }
    },
    mounted(){
        // 监听新消息
        this.$bus.$on('talk', (content) => {
            this.updateNewMessage(content)
        });
        // 监听撤回消息
        this.$bus.$on('revoke', (content) => {
            this.updateRevokeMessage(content)
        });

        // 清除未读
        this.talkId = this.$route.query.talkId || ''
        if(this.talkId)this.clearUnread()
        // 赋值
        this.selfInfo.id = getUserId()
        this.receiveInfo.id = this.$route.params.id
        // 获取好友或群的信息
        this.loadReceiveInfo()
        // 获取聊天列表实例，用于滚动计算
        this.container = this.$refs.chatpage;
    },
    beforeDestroy() {
        // 移除事件监听
        this.$bus.$off('talk');
        this.$bus.$off('revoke');
    },
    methods:{
        // 监听到有新消息
        updateNewMessage(content){
            if(content.talk_type != this.talk_type)return this.$store.dispatch('chat/noticeNewMessage', content) // 聊天类型不同，不是当前聊天的消息
            if(content.sender_id != this.receiveInfo.id && content.receiver_id != this.receiveInfo.id)return this.$store.dispatch('chat/noticeNewMessage', content) // 这条消息的发送者和接受者都是当前好友或者群，不是当前聊天的消息
            // TODO 如果有发红包功能还需另外判断
            // 当前好友或者群，有新消息了
            this.list.push(content.data)
            // 添加完数据后，带动画的滚动到最底部
            this.scrollToBottom(true)
        },
        // 监听到有撤回消息
        updateRevokeMessage(content){
            if(content.talk_type != this.talk_type)return this.$store.dispatch('chat/noticeNewMessage', content) // 聊天类型不同，不是当前聊天的消息
            if(content.sender_id != this.receiveInfo.id && content.receiver_id != this.receiveInfo.id)return this.$store.dispatch('chat/noticeNewMessage', content) // 这条消息的发送者和接受者都是当前好友或者群，不是当前聊天的消息
            const index = this.list.findIndex(item=>item.id == content.record_id)
            if(index>=0){
                // 找到并修改指定数据的撤回状态为撤回
                const message = this.list[index]
                message.is_revoke = 1
                this.$set(this.list, index, message)
            }
        },
        // 清除未读
        clearUnread(){
            this.$chatApi.post(`/api/chat/talk_sessions/${this.talkId}/clear_unread_count`).catch(() => { })
        },
        // 获取好友或群的信息
        loadReceiveInfo(){
            if(this.talk_type==1){
                this.$chatApi.get(`/api/chat/friends/${this.$route.params.id}`).then(res => {
                    this.receiveInfo.avatar = res.avatar
                    this.receiveInfo.nickname = res.remark || res.nickname
                }).catch(() => { })
            }else{
                this.receiveInfo.nickname = t('消息')
                this.receiveInfo.is_silence = false
                this.receiveInfo.role = 2
            }
        },
        // 加载聊天记录
        loadRecord() {
            if (this.finished) return
            this.finished = false
            this.loading = true
            // 记录加载下一页前往上滚动了多少
            const distance = this.container.scrollHeight - this.container.scrollTop;
            this.$chatApi.get('/api/chat/talk_records', {
                talk_type: this.talk_type,
                receiver_id: this.receiveInfo.id,
                record_id: this.record_id
            }).then(res => {
                // 加载下一页时要传入的id
                this.record_id = res.record_id
                // 倒叙列表
                const list = res.rows.reverse()
                this.loading = false
                this.finished = list.length < res.limit
                if (this.list.length == 0) {
                    // 首次加载直接滚动到底部
                    this.list = list.concat(this.list)
                    this.scrollToBottom()
                } else {
                    // 分页加载需要滚动到上一页最上面那个元素
                    this.list = list.concat(this.list)
                    this.$nextTick(() => {
                        const newContentHeight = this.container.scrollHeight - distance;
                        this.container.scrollTop = newContentHeight;
                    });
                }
            }).catch(() => { })
        },
        // 删除消息后，手动删除列表中对应的数据
        deleteMeaasge(id){
            const index = this.list.findIndex(item=>item.id==id)
            if(index>=0)this.list.splice(index, 1)
        },
        // 撤回消息后，手动改变列表中对应消息的状态
        revokeMeaasge(id){
            const index = this.list.findIndex(item=>item.id==id)
            const data = this.list[index]
            data['is_revoke'] = 1
            this.$set(this.list, index, data)
        },
        // 页面滚动时关闭气泡弹窗
        chatScroll: throttle(function() {
            this.pageBlur()
        }, 200),
        // 添加路由栈或者返回，避免两个页面一直叠加路由栈
        goReceiveHome(){
            const isFromHome = this.$route.query.isFromHome
            if(isFromHome){
                this.back()
            }else{
                this.$router.push({
                    path:`/${this.talk_type==1?'friendHome':'groupDetail'}/${this.receiveInfo.id}`,
                    query: {
                        isFromChat: true
                    }
                })
            }
        },
        // 关闭底部操作面板
        blurBotbar() {
            this.pageBlur()
            this.$refs.botbar.botbarBlur()
        },
        // 列表失焦，关闭气泡弹窗
        pageBlur(){
            if(this.$refs.sheet)this.$refs.sheet.close()
        },
        // 是否带动画的滚动到最底部
        scrollToBottom(animate = false) {
            this.$nextTick(() => {
                if (animate) {
                    // 平滑滚动
                    this.container.scrollTo({
                        top: this.container.scrollHeight,
                        behavior: 'smooth'
                    });
                } else {
                    this.container.scrollTop = this.container.scrollHeight;
                }
            });
        },
        // 打开红包详情弹窗
        openGiftPop() {
            this.$refs.giftPopup.open()
        },
        // 两条消息之间间隔5分钟后，才显示时间
        timeShow(index){
            if(index==0){
                return true
            }else{
                let a = this.list[index].created_at
                let b = this.list[index-1].created_at
                a = new Date(a).getTime()
                b = new Date(b).getTime()
                return a-b >= 300000
            }
        },
        // 播放音频
        playAudio(url, messageId){
            console.log(url);
            
            // 如果已有音频在播放，先停止
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.remove();
                // 通知所有音频组件停止播放
                this.$bus.$emit('stop-audio-play', this.currentMessageId);
            }
            
            // 创建新音频并播放
            this.currentAudio = new Audio(url);
            this.currentMessageId = messageId;
            this.currentAudio.play()
            .catch((error) => {
                this.fail(t('播放失败'))
            });
            
            // 播放结束后清理
            this.currentAudio.addEventListener("ended", () => {
                this.currentAudio.remove();
                this.currentAudio = null;
                this.currentMessageId = null;
                // 通知所有音频组件停止播放
                this.$bus.$emit('stop-audio-play', messageId);
            });
        },
        // 打开气泡弹窗
        openSheet(option){
            this.$refs.sheet.close()
            setTimeout(() => {
                this.$nextTick(()=>{
                    this.$refs.sheet.open(option)
                })
            }, 100);
        },
        // 当点击消息的头像时
        onAvatarClick({ user_id, avatar, nickname }){
            return;
            // 点击自己的头像跳到个人设置
            if(user_id == this.selfInfo.id)return this.jump('/setting')
            if(this.talk_type==1){
                // 单聊跳好友主页
                this.goReceiveHome()
            }else{
                // 群聊跳群员主页
                this.$router.push({
                    path:'/groupHome',
                    query: {
                        id: user_id,
                        nickname,
                        avatar,
                        groupId: this.receiveInfo.id
                    }
                })
            }
        }
    }
}