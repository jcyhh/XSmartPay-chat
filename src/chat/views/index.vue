<template>
    <div>
        <!-- 导航栏 -->
        <div class="chatHead flex jb ac pr30 pl30">
            <div class="flex1">
                <van-icon name="arrow-left" :size="25" @click="back" />
            </div>
            <div class="flex1 size32 bold tc">{{ $t('消息') }}</div>
            <div class="flex1"></div>
            <div class="flex1 flex je ac" v-if="false">
                <!-- 好友列表 -->
                <div class="img40 mr30 rel">
                    <img src="@/chat/assets/1.png" class="img40 block" @click="jump('/friends')">
                    <!-- 新好友申请提醒 -->
                    <div class="circle" v-show="applyCount>0"></div>
                </div>
                <!-- 下拉菜单 -->
                <van-popover
                    v-model="showPopover"
                    trigger="click"
                    theme="dark"
                    placement="bottom-end"
                >
                    <div class="chatCard chatCardBg">
                        <div class="flex ac" @click="jump('/groupCreate')">
                            <img src="@/chat/assets/20.png" class="img34 mr20">
                            <div class="size28">{{ $t('创建群聊') }}</div>
                        </div>
                        <div class="chatRowLine mt20 mb20"></div>
                        <div class="flex ac" @click="jump('/groupsOfficial')">
                            <img src="@/chat/assets/20.png" class="img34 mr20">
                            <div class="size28">{{ $t('添加群聊') }}</div>
                        </div>
                        <div class="chatRowLine mt20 mb20"></div>
                        <div class="flex ac" @click="jump('/friendSearch')">
                            <img src="@/chat/assets/21.png" class="img34 mr20">
                            <div class="size28">{{ $t('添加好友') }}</div>
                        </div>
                    </div>
                    <template #reference>
                        <img src="@/chat/assets/0.png" class="img40 block" slot="reference">    
                    </template>
                </van-popover>
            </div>
        </div>

        <div class="gap100"></div>

        <div class="chatList">

            <van-pull-refresh style="height:calc(100vh - 200px)" v-model="refreshing" @refresh="loadList">

                <van-swipe-cell v-for="(item, index) in list" :key="item.id">
                    <div class="flex jb ac pl30 pr30" :class="item.topped_at&&item.topped_at==='1970-01-01 08:00:00'?'top':''" @click="goChatPage(item)">
                        <img v-lazy="item.avatar" class="chatListItemAvatar avatar mr20 flexS">
                        <div class="flex1 chatListItemRight flex col jc">
                            <div class="flex jb ac mb10">
                                <div class="size30">{{ item.name }}</div>
                                <div class="size24 chatGray">{{ item.updated_at | initTime }}</div>
                            </div>
                            <div class="flex jb ac">
                                <!-- 如果有人@我 -->
                                <div class="size26 chatRed chatListMessage" v-if="item.is_at">{{ $t('有人@我') }}</div>
                                <div v-else>
                                    <!-- 消息撤回 -->
                                    <div class="size26 chatGray chatListMessage" v-if="item.msg_text.startsWith('3chytxx3&@_$')">
                                        {{getWho(item)}} {{ $t('撤回了一条消息') }}
                                    </div>
                                    <!-- 文本消息 -->
                                    <div class="size26 chatGray chatListMessage line1 richText" v-html="initRichText(item.msg_text)" v-else></div>
                                </div>
                                <div></div>
                                <!-- 未读消息数，大于0显示，大于99显示99+ -->
                                <div class="chatListCircle flex jc ac" v-if="item.unread_count > 0">
                                    {{ item.unread_count >= 100 ? '99+' : item.unread_count }}</div>
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <div class="delTalk flex ac" @click="delayFun(delTalk, index)">{{ $t('删除会话') }}</div>
                    </template>
                </van-swipe-cell>

                <chat-empty v-if="list.length==0"></chat-empty>
                <div class="flex jc" v-if="loading">
                    <van-loading size="24px">{{ $t('加载中') }}...</van-loading>
                </div>

            </van-pull-refresh>


            <div class="safeArea"></div>
        </div>
    </div>
</template>

<script>
import { getUserId } from '@/chat/config'
import { initRichText } from '@/chat/utils'
import { t } from '@/main'
export default {
    data() {
        return {
            userId:'', // 用户id
            applyCount:0, // 好友申请数量
            showPopover: false,

            refreshing:false,
            loading:false,
            list:[],

            initRichText
        }
    },
    mounted() {
        this.userId = getUserId()
        // this.loadData()
        this.loadList()
        // 监听新消息
        this.$bus.$on('talk', () => {
            console.log('123456');
            
            this.loadList(false)
        });
        // 监听撤回消息
        this.$bus.$on('revoke', () => {
            this.loadList(false)
            // TODO撤回消息后端没刷新列表上的消息为【3chytxx3&@_$】开头
        });
    },
    beforeDestroy() {
        // 移除事件监听
        this.$bus.$off('talk');
        this.$bus.$off('revoke');
    },
    methods: {
        back(){
            window.parent.postMessage({
                type:'back',
                data:''
            },'*')
        },
        loadList(flag=true){
            if(flag)this.loading = true
            if (this.refreshing) this.refreshing = false
            this.$chatApi.get('/api/chat/talk_sessions').then(res=>{
                this.list = res.talk_sessions
                if(flag)this.loading = false
            }).catch(() => { })
        },
        loadData(){
            // 好友申请数量
            this.$chatApi.get('/api/chat/friend_applies/pending_count').then(res=>{
                this.applyCount = res.pending_count
            }).catch(()=>{})
        },
        // 删除会话
        delTalk(index){
            let id = this.list[index].id
            this.$chatApi.del(`/api/chat/talk_sessions/${id}`).then(()=>{
                this.list.splice(index, 1)
            }).catch(() => { })
        },
        getWho(data){
            let arr = data.msg_text.split('&@_$')
            let id = arr[2]
            // 自己撤回的消息
            if(id == this.userId)return `${t('你')} `
            let name = arr[1]
            // 他人撤回的消息
            return `"${name}" `
        },
        goChatPage(data){
            if(data.talk_type==1){
                this.$router.push({
                    path:`/friend/${data.receiver_id}`,
                    query: {
                        talkId: data.id,
                        name: data.name,
                        avatar: data.avatar
                    }
                })
            }else{
                this.$router.push({
                    path:`/group/${data.receiver_id}`,
                    query: {
                        talkId: data.id
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss">
@use "@/chat/styles/index.scss" as *;
.chatHead {
    width: 100vw;
    height: 100px;
    background-color: $chat-nav-bg;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
.circle{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: $chat-color;
    position: absolute;
    top: -5px;
    right: -10px;
}

.chatList {
    min-height: calc(100vh - 100px);
    background-color: $chat-page-bg;

    .chatListItemAvatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .chatListItemRight {
        width: 570px;
        height: 160px;
        border-bottom: 1PX solid $chat-card-line;

        .chatListMessage {
            width: 430px;
        }

        .chatListCircle {
            height: 30px;
            border-radius: 15px;
            font-size: 20px;
            font-weight: bold;
            color: $chat-btn-txt-color;
            background-color: $chat-color;
            padding: 0 15px;
        }
    }
}
.delTalk{
    height: 100%;
    padding: 0 30px;
    background-color: $chat-red;
    color: #FFFFFF;
}
</style>