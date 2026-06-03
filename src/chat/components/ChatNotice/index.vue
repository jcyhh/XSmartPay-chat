<template>
    <div class="chatNotice flex jb ac" :class="show?'showChatNotice':'hideChatNotice'" @click="goChat">
        <div class="flex ac">
            <img :src="message.avatar" class="img88 avatar mr20">
            <div>
                <div class="size28 mb10">{{ message.nickname }}</div>
                <div class="size24 chatGray line1" v-html="content"></div>
            </div>
        </div>
        <div class="flex0 ml30">
            <van-icon name="arrow"></van-icon>
        </div>
    </div>
</template>

<script>
import { initRichText } from '@/chat/utils'
import { getUserId } from '@/chat/config'
import { t } from '@/main'
export default {
    data(){
        return {
            show:false,
            message:'',
            content:'',
            talk_type:1,
            toId:'',
            talkId:'',
            timer:null
        }
    },
    methods:{
        open(content){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            const data = content.data
            this.talk_type = data.talk_type
            this.toId = this.talk_type==1 ? data.user_id : data.receiver_id
            this.talkId = [this.talk_type, getUserId(), this.toId].join('_')
            this.message = data
            if(data.msg_type==1){
                this.content = initRichText(data.content)
            }else if(data.msg_type==2){
                this.content = `[${t('文件消息')}]`
            }
            // TODO其他消息类型
            this.$nextTick(()=>{
                this.show = true
                this.timer = setTimeout(() => {
                    this.show = false
                }, 1500);
            })
        },
        goChat(){
            this.show = false
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            this.$router.replace({
                path:`/${this.talk_type==1?'friend':'group'}/${this.toId}`,
                query: {
                    talkId: this.talkId
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chatNotice{
    width: 690px;
    padding: 30px;
    border-radius: 30px;
    background-color: $chat-card-bg;
    position: fixed;
    left: 30px;
    z-index: 100000000000;
    transition: all 0.3s;
}
.showChatNotice{
    top: 30px;
}
.hideChatNotice{
    top: -230px;
}
</style>