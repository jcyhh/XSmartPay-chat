<template>
    <div>
        <div class="gap20"></div>
        <!-- 自己 -->
        <div class="flex je" v-if="message.user_id == userId">
            <div class="chatSelfGiftBubble" @click="emitClick">
                <div class="chatSelfGiftRect"></div>
                <div class="flex ac">
                    <img src="@/chat/assets/10.png" class="chatGiftIcon">
                    <div class="ml20">
                        <div class="size30 line1 chatGiftTitle">{{ $t('恭喜发财，大吉大利') }}</div>
                        <div class="size24 mt10">{{ $t('领取红包') }}</div>
                    </div>
                </div>
                <div class="chatGiftLine mt15 mb12"></div>
                <div class="size24">{{ $t('普通红包') }}</div>
            </div>
            <img :src="avatarSrc" class="chatAvatar avatar ml30">
        </div>
        <!-- 他人 -->
        <div class="flex" v-else>
            <img :src="avatarSrc" class="chatAvatar avatar mr30">
            <div class="chatGiftBubble" @click="emitClick">
                <div class="chatGiftRect"></div>
                <div class="flex ac">
                    <img src="@/chat/assets/10.png" class="chatGiftIcon">
                    <div class="ml20">
                        <div class="size30 line1 chatGiftTitle">{{ $t('恭喜发财，大吉大利') }}</div>
                        <div class="size24 mt10">{{ $t('领取红包') }}</div>
                    </div>
                </div>
                <div class="chatGiftLine mt15 mb12"></div>
                <div class="size24">{{ $t('普通红包') }}</div>
            </div>
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
import defaultAvatar from '@/chat/assets/avatar.png'

export default {
    props:{
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
        }
    },
    methods:{
        emitClick(){
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chatGiftBubble{
    padding: 20px;
    background-color: $chat-bubble-gift-bg;
    border-radius: 10px;
    position: relative;
    color: $chat-bubble-gift-color;
    .chatGiftRect{
        width: 25px;
        height: 25px;
        background-color: $chat-bubble-gift-bg;
        transform: rotate(45deg);
        position: absolute;
        left: -10px;
        top: 26px;
    }
}
.chatSelfGiftBubble{
    padding: 20px;
    background-color: $chat-bubble-gift-bg;
    border-radius: 10px;
    position: relative;
    color: $chat-bubble-gift-color;
    .chatSelfGiftRect{
        width: 25px;
        height: 25px;
        background-color: $chat-bubble-gift-bg;
        transform: rotate(45deg);
        position: absolute;
        right: -10px;
        top: 26px;
    }
}
.chatGiftDisable{
    background-color: $chat-bubble-gift-disable-bg !important;
}
.chatGiftIcon{
    width: 70px;
    height: 82px;
}
.chatGiftTitle{
    width: 300px;
}
.chatGiftLine{
    width: 100%;
    height: 1PX;
    background-color: #eeeeee;
}
</style>