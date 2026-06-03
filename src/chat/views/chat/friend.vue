<template>
    <div>
        <chat-nav :title="receiveInfo.nickname">
            <van-icon name="ellipsis" size="30" @click="goReceiveHome" />
        </chat-nav>


        <div class="chatpage" ref="chatpage" @click="blurBotbar" @scroll="chatScroll">
            <van-list offset="0" v-model="loading" direction="up" :finished="finished" :finished-text="$t('没有更多了')"
                @load="loadRecord">

                <div v-for="(item,index) in list" :key="item.id">

                    <div v-if="item.msg_type <= 3">
                        <!-- 消息被撤回通知 -->
                        <notice-revoke v-if="item.is_revoke == 1" :message="item" :userId="selfInfo.id"></notice-revoke>
                        <div v-else>
                            <!-- 消息发送时间 -->
                            <div class="tc gray pt30 pb30 size24" v-if="timeShow(index)">{{ item.created_at | initTime }}</div>
                            <!-- 文案消息 -->
                            <chat-text v-if="item.msg_type == 1" :message="item" :userId="selfInfo.id" :talkType="talk_type" @openSheet="openSheet" @onAvatarClick="onAvatarClick"></chat-text>
                            <!-- 文件消息 -->
                            <div v-if="item.msg_type == 2">
                                <!-- 图片消息 -->
                                <chat-image v-if="getFileType(item) === 'image'" :message="item" :userId="selfInfo.id" :talkType="talk_type" @openSheet="openSheet" @onAvatarClick="onAvatarClick"></chat-image>
                                <!-- 视频消息 -->
                                <chat-video v-if="getFileType(item) === 'video'" :message="item" :userId="selfInfo.id" :talkType="talk_type" @openSheet="openSheet" @onAvatarClick="onAvatarClick"></chat-video>
                                <!-- 音频消息 -->
                                <chat-voice v-if="getFileType(item) === 'voice'" :message="item" :userId="selfInfo.id" :talkType="talk_type" @play="playAudio" @openSheet="openSheet" @onAvatarClick="onAvatarClick"></chat-voice>
                            </div>
                            <!-- 红包消息 -->
                            <chat-gift v-if="item.msg_type == 3" :message="item" :userId="selfInfo.id"></chat-gift>
                        </div>
                    </div>

                    <!-- 红包领取通知 -->
                    <notice-gift v-else-if="item.msg_type == 4"></notice-gift>

                </div>



            </van-list>

            <chat-botbar ref="botbar" :talkType="talk_type" :toId="receiveInfo.id"
                @show="scrollToBottom(true)"></chat-botbar>
        </div>

        <gift-popup ref="giftPopup"></gift-popup>

        <chat-sheet ref="sheet" :talkType="talk_type" :toId="receiveInfo.id" @deleteMeaasge="deleteMeaasge" @revokeMeaasge="revokeMeaasge"></chat-sheet>
    </div>
</template>

<script>
/**
 * msg_type 1-文案消息 2-文件消息（图片、视频、音频）3-红包消息 4-红包领取通知 9-群成员变动消息 10-定位位置消息
 * msg_type==9 && invite.type 1-某人邀请了某些人加入群聊 2-某些人退出了群聊 3-某些人被某人踢出了群聊
 * is_revoke 1-被撤回的消息
 */
import chatMixin from '@/chat/mixins/chat'
export default {
    mixins:[chatMixin],
    data(){
        return {
            talk_type:1
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chatpage {
    width: 100vw;
    height: calc(100vh - 120px);
    padding: 0 30px;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        display: none;
    }
}
</style>