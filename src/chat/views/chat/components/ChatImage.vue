<template>
    <div>
        <div class="gap20"></div>
        <!-- 自己 -->
        <div class="flex je" v-if="message.user_id == userId">
            <div class="chatImage" v-longtap="openSelfSheet" @click="lookImg">
                <img v-lazy="message.file.file_url" class="block" :style="{
                    width: `${width}px`,
                    height: `${height}px`
                }">
            </div>
            <img v-lazy="avatarSrc" class="chatAvatar avatar ml30" @click="onAvatarClick">
        </div>
        <!-- 他人 -->
        <div class="flex" v-else>
            <img v-lazy="avatarSrc" class="chatAvatar avatar mr30" @click="onAvatarClick">
            <div>
                <div class="size22 chatGray mb10" v-if="talkType==2">{{ message.nickname }}</div>
                <div class="chatImage" v-longtap="openSheet" @click="lookImg">
                    <img v-lazy="message.file.file_url" class="block" :style="{
                        width: `${width}px`,
                        height: `${height}px`
                    }">
                </div>
            </div>
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
import { computedDiv, computedMul } from '@/chat/utils';
import { ImagePreview } from 'vant';
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
    computed:{
        avatarSrc(){
            return this.message.avatar || defaultAvatar
        },
        width(){
            const initWidth = this.message.file.width
            const maxWidth = computedMul(window.innerWidth, 0.3)
            return initWidth > maxWidth ? maxWidth : initWidth
        },
        height(){
            const initWidth = this.message.file.width
            const initHeight = this.message.file.height
            return computedDiv(computedMul(initHeight, this.width), initWidth)
        }
    },
    methods:{
        lookImg(){
            ImagePreview([this.message.file.file_url])
        },
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
.chatImage{
    max-width: 30vw;
    max-height: 90vw;
    border-radius: 10px;
    overflow: hidden;
}
</style>