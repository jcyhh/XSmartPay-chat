<template>
    <div>
        <div class="gap20"></div>
        <!-- 自己 -->
        <div class="flex je" v-if="message.user_id == userId">
            <div class="chatSelfBubble" v-longtap="openSelfSheet" @click="play(true)">
                <div class="chatSelfBubbleRect"></div>
                <div class="size30 br flex ac">
                    <div>{{ message.file.width }}”</div>
                    <img src="@/chat/assets/voiceSelf.gif" class="img36 ml10" v-if="isSelfPlaying && show">
                    <img src="@/chat/assets/voiceSelf.png" class="img36 ml10" v-else>
                </div>
            </div>
            <img v-lazy="avatarSrc" class="chatAvatar avatar ml30" @click="onAvatarClick">
        </div>
        <!-- 他人 -->
        <div class="flex" v-else>
            <img v-lazy="avatarSrc" class="chatAvatar avatar mr30" @click="onAvatarClick">
            <div>
                <div class="size22 chatGray mb10" v-if="talkType==2">{{ message.nickname }}</div>
                <div class="chatBubble" v-longtap="openSheet" @click="play(false)">
                    <div class="chatBubbleRect"></div>
                    <div class="size30 br flex ac">
                        <img src="@/chat/assets/voice.gif" class="img36 mr10" v-if="!isSelfPlaying && show">
                        <img src="@/chat/assets/voice.png" class="img36 mr10" v-else>
                        <div>{{ message.file.width }}”</div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
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
    data(){
        return {
            show: false,
            isSelfPlaying: false
        }
    },
    computed:{
        avatarSrc(){
            return this.message.avatar || defaultAvatar
        }
    },
    mounted() {
        // 监听音频播放状态变化
        this.$bus.$on('stop-audio-play', (messageId) => {
            if (messageId == this.message.id) {
                this.show = false;
                this.isSelfPlaying = false;
            }
        });
    },
    beforeDestroy() {
        // 移除事件监听
        this.$bus.$off('stop-audio-play');
    },
    methods:{
        play(type){
            this.isSelfPlaying = type
            this.$emit('play', this.message.file.file_url, this.message.id)
            this.show = true
            setTimeout(() => {
                this.show = false
            }, this.message.file.width * 1000);
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
                copy:false, // 音频不可复制
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
                copy:false, // 音频不可复制
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