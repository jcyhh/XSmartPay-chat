<template>
    <div>
        <div class="gap20"></div>
        <!-- 自己 -->
        <div class="flex je" v-if="message.user_id == userId">
            <div class="chatVideo">
                <img :src="posterSrc" class="chatImage" :style="{
                    width: `${width}px`,
                    height: `${height}px`
                }">
                <div class="chatVideoMask flex jc ac" v-longtap="openSelfSheet" @click="preview">
                    <img src="@/chat/assets/11.png" class="img46">
                </div>
            </div>
            
            <img v-lazy="avatarSrc" class="chatAvatar avatar ml30" @click="onAvatarClick">
        </div>
        <!-- 他人 -->
        <div class="flex" v-else>
            <img v-lazy="avatarSrc" class="chatAvatar avatar mr30" @click="onAvatarClick">
            <div>
                <div class="size22 chatGray mb10" v-if="talkType==2">{{ message.nickname }}</div>
                <div class="chatVideo">
                    <img v-lazy="posterSrc" class="chatImage" :style="{
                        width: `${width}px`,
                        height: `${height}px`
                    }">
                    <div class="chatVideoMask flex jc ac" v-longtap="openSheet" @click="preview">
                        <img src="@/chat/assets/11.png" class="img46">
                    </div>
                </div>
            </div>
            
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
import { computedDiv, computedMul } from '@/chat/utils';
import { baseUrl } from '@/chat/config';
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
        posterSrc() {
            // return `${baseUrl}/video_thumbnail/huifu${this.message.file.file_path}`
            return this.message.file.file_url.replace(/\.\w+$/, '.png')
        },
        width(){
            // 接口里视频的宽和高是反过来的返回的
            const initWidth = this.message.file.height
            const maxWidth = computedMul(window.innerWidth, 0.3)
            return initWidth > maxWidth ? maxWidth : initWidth
        },
        height(){
            const initWidth = this.message.file.height
            const initHeight = this.message.file.width
            return computedDiv(computedMul(initHeight, this.width), initWidth)
        }
    },
    methods:{
        preview(){
            window.open(this.message.file.file_url)
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
.chatVideo{
    position: relative;
    border-radius: 10px;
    background-color: $chat-card-bg;
    .chatImage{
        max-width: 30vw;
        max-height: 90vw;
        border-radius: 10px;
        display: block;
    }
    .chatVideoMask{
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba($color: #000000, $alpha: 0.5);
        left: 0;
        top: 0;
        border-radius: 10px;
        z-index: 1;
    }
}

</style>