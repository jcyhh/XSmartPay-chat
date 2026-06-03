<template>
    <div @click.stop="pageBlur">
        <div class="chatBotbar">
            <div class="flex jb pt14 pb14 pl30 pr30">
                <!-- 表情 -->
                <div class="chatBotbarBox flex jc ac">
                    <img src="@/chat/assets/2.png" class="img48" @click="emojiChange">
                </div>
                <!-- 输入框 -->
                <textarea ref="chatTextArea" class="chatareaBox size26" rows="1" v-model="content" enterkeyhint="send" inputmode="text" @focus="onFocus" @input="autoHeight" @keydown.enter.prevent="sendMessage"></textarea>
                <!-- 菜单 -->
                <div class="chatBotbarBox flex jc ac" @click="menuChange">
                    <img src="@/chat/assets/4.png" class="img48">
                </div>
            </div>

            <!-- 菜单 -->
            <div class="chatBotMenu flex animate__animated animate__slideInLeft" v-if="menuShow">
                <div class="tc mr60 size0">
                    <img src="@/chat/assets/6.png" class="img104" v-scale @click="delayFun(sendImage)">
                    <div class="size28 mt20">{{ $t('图片') }}</div>
                </div>
                
                <!-- <div class="tc mr60 size0">
                    <img src="@/chat/assets/7.png" class="img104" v-scale @click="delayFun(sendVideo)">
                    <div class="size28 mt20">{{ $t('视频') }}</div>
                </div> -->
                
                <!-- <div class="tc size0">
                    <img src="@/chat/assets/8.png" class="img104" v-sacle @click="delayFun(jump, '/giftSend')">
                    <div class="size28 mt20">红包</div>
                </div> -->
            </div>

            <!-- 表情 -->
            <div class="chatEmoji flex wrap animate__animated animate__slideInUp" v-if="emojiShow">
                <div class="img50 mr50 mb50 size50" v-for="(item, index) in emojiList" :key="index" @click="onEmojiClick(item)">
                    {{ String.fromCodePoint(item.unicode) }}
                </div>
            </div>

            <!-- ios安全区域 -->
            <div class="safeArea"></div>
        </div>

        <div @click="botbarBlur">
            <div class="gap100"></div>
            <div class="gap500" v-if="menuShow||emojiShow"></div>
            <div class="safeArea"></div>
        </div>
        
    </div>
</template>

<script>
import { emojiList } from '@/chat/utils';
export default {
    props:{
        talkType:{
            type:Number,
            default:1
        },
        toId:{
            type:[Number, String],
            default:''
        }
    },
    data() {
        return {
            menuShow: false, // 菜单是否显示
            emojiShow: false, // 表情是否显示

            content: '',

            emojiList, // 表情数据
        }
    },
    mounted() {
    },
    methods: {
        // 点击底部区域触发页面失焦
        pageBlur(){
            this.$emit('blur')
        },
        // 点击聊天区域或输入框等，收起菜单、表情
        botbarBlur() {
            this.menuShow = false
            this.emojiShow = false
        },
        // 表情显示
        emojiChange() {
            this.menuShow = false
            this.emojiShow = !this.emojiShow
            // 页面滚动到最底部
            if(this.emojiShow)this.$emit('show')
        },
        // 菜单显示
        menuChange() {
            this.emojiShow = false
            this.menuShow = !this.menuShow
            // 页面滚动到最底部
            if(this.menuShow)this.$emit('show')
        },
        // 点击表情，插入到输入框
        onEmojiClick(data){
            const textarea = this.$refs.chatTextArea;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const insertedChar = String.fromCodePoint(data.unicode);
            textarea.value = textarea.value.slice(0, start) + insertedChar + textarea.value.slice(end);
            this.content = textarea.value
            requestAnimationFrame(() => {
                textarea.setSelectionRange(
                    start + insertedChar.length,
                    start + insertedChar.length
                );
            });
        },
        // 当输入框聚焦
        onFocus(){
            // 隐藏操作菜单
            this.botbarBlur()
            // 页面滚动到最底部
            this.$emit('show')
        },
        // 自动高度
        autoHeight(){
            const textarea = this.$refs.chatTextArea;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        },
        // 发送文本
        sendMessage(){
            if(!this.content)return
            this.$chatApi.post('/api/chat/talk_messages/text',{
                talk_type: this.talkType,
                receiver_id: this.toId,
                text: this.content
            }).then(()=>{
                this.content = ''
            }).catch(() => { })
        },
        // 发送图片
        sendImage(){
            this.$chatApi.uploadFile('/api/chat/talk_messages/image',{
                filename: 'image',
                accept: 'image/*',
                extraParams: {
                    talk_type: this.talkType,
                    receiver_id: this.toId
                }
            }).catch(()=>{})
        },
        // 发送视频
        sendVideo(){
            this.$chatApi.uploadFile('/api/chat/talk_messages/video',{
                filename: 'video',
                accept: 'video/*',
                extraParams: {
                    talk_type: this.talkType,
                    receiver_id: this.toId
                }
            }).catch(()=>{})
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chatBotbar {
    width: 100vw;
    min-height: 100px;
    background-color: $chat-card-bg;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;

    .chatBotbarBox {
        width: 48px;
        height: 70px;
    }

    .chatareaBox {
        padding: 20px;
        width: 540px;
        min-height: 70px;
        border-radius: 35px;
        background-color: $chat-card-box-bg;
        border: none;
        resize: none;
        overflow-y: hidden;
        &::placeholder{
            color: #79819A;
        }
        &::-webkit-scrollbar{
            display: none;
        }
    }

    .chatBotMenu {
        width: 100vw;
        height: 500px;
        padding: 30px 0 0 40px;
        animation-duration: 0.3s !important;
    }

    .chatEmoji {
        width: 100vw;
        height: 500px;
        overflow-y: auto;
        padding-left: 30px;
        animation-duration: 0.3s !important;
        &::-webkit-scrollbar{
            display: none;
        }
    }
}
.gap500{
    width: 100%;
    height: 500px;
}
</style>