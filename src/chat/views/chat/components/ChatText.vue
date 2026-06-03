<template>
    <div class="rel">
        <div class="gap20"></div>
        <!-- 自己 -->
        <div class="flex je" v-if="message.user_id == userId">
            <div class="chatSelfBubble" v-longtap="openSelfSheet">
                <div class="chatSelfBubbleRect"></div>
                <div class="size28 br chatText" v-html="initRichText(message.content)"></div>
            </div>
            <img v-lazy="avatarSrc" class="chatAvatar avatar ml30" @click="onAvatarClick">
        </div>
        <!-- 他人 -->
        <div class="flex" v-else>
            <img v-lazy="avatarSrc" class="chatAvatar avatar mr30" @click="onAvatarClick">
            <div>
                <div class="size22 chatGray mb10" v-if="talkType==2">{{ message.nickname }}</div>
                <div class="chatBubble" v-longtap="openSheet">
                    <div class="chatBubbleRect"></div>
                    <div class="size28 br chatText" v-html="initRichText(message.content)"></div>
                </div>
            </div>
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
import { initRichText } from '@/chat/utils'
import defaultAvatar from '@/chat/assets/avatar.png'
export default {
    props:{
        talkType:{
            type:Number,
            default:1
        },
        message:{
            type:Object,
            default(){
                return {}
            }
        },
        userId:{
            type:[Number, String],
            default:''
        }
    },
    data() {
        return {
            sheetOption:{
                copy:false,
                delete:false,
                revoke:false,
                self:false
            },
            initRichText
        }
    },
    computed:{
        avatarSrc(){
            return this.message.avatar || defaultAvatar
        }
    },
    methods:{
        openSheet(event){
            const info = {
                x:Math.floor(event.x),
                y:Math.floor(event.y),
                height:Math.floor(event.height),
                width:Math.floor(event.width),
                message:this.message
            }
            this.$emit('openSheet',{
                copy:true,
                delete:true,
                revoke:false, // 不可撤回他人消息
                self:false,
                ...info
            })
        },
        openSelfSheet(event){
            const info = {
                x:Math.floor(event.x),
                y:Math.floor(event.y),
                height:Math.floor(event.height),
                width:Math.floor(event.width),
                message:this.message
            }
            this.$emit('openSheet',{
                copy:true,
                delete:true,
                revoke:true,
                self:true,
                ...info
            })
        },
        onAvatarClick(){
            const { user_id, avatar, nickname } = this.message
            this.$emit('onAvatarClick', {
                user_id,
                avatar: avatar || defaultAvatar,
                nickname
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>