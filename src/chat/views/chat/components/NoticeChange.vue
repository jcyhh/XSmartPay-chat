<template>
    <div>
        <div class="gap10" v-if="message.invite.type"></div>
        <!-- 某人 邀请 某些人 加入群聊 -->
        <div v-if="message.invite.type==1">
            <!-- 用户注册后自动进入的群聊 -->
            <div class="flex jc ac size24" v-if="isAutoJoin">
                <span class="revoke">{{ isAutoJoin }}</span>
                <span class="chatGray ml5">{{ $t('加入群聊') }}</span>
            </div>
            <div class="flex jc ac size24" v-else>
                <span class="revoke">{{ subjectText }}</span>
                <span class="chatGray ml5 mr5">{{ $t('邀请') }}</span>
                <span class="revoke">{{ objectText }}</span>
                <span class="chatGray ml5">{{ $t('加入群聊') }}</span>
            </div>
        </div>
        <!-- 某些人 主动退出了群聊 -->
        <div class="flex jc ac size24" v-if="message.invite.type==2">
            <span class="revoke">{{ subjectText }}</span>
            <span class="chatGray ml5">{{ $t('退出了群聊') }}</span>
        </div>
        <!-- 某些人 被 某人 踢出了群聊 -->
        <div class="flex jc ac size24" v-if="message.invite.type==3">
            <span class="revoke">{{ subjectText }}</span>
            <span class="chatGray ml5 mr5">{{ $t('被') }}</span>
            <span class="revoke">{{ objectText }}</span>
            <span class="chatGray ml5">{{ $t('踢出了群聊') }}</span>
        </div>
        <div class="gap10" v-if="message.invite.type"></div>
    </div>
</template>

<script>
import { t } from '@/main'

// TODO 后端在type：2、3时没有返回users
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
        // 主语
        subjectText(){
            const data = this.message.invite
            if(data){
                if(data.type==1)return this.userId == data.operate_user.id ? t('你') : data.operate_user.nickname
                else if(data.type==2 || data.type==3)return this.message.users.map(item=>item.nickname).join(' ')
            }
            return ''
        },
        // 宾语
        objectText(){
            const data = this.message.invite
            if(data){
                if(data.type==1)return data.users.map(item=>item.nickname).join(' ')
                else if(data.type==3)return data.operate_user.nickname
            }
            return ''
        },
        // 非主动进入群聊
        isAutoJoin(){
            const data = this.message.invite
            if(data.type==1 && data.users.length==1 && data.operate_user.id == data.users[0].id)return this.userId == data.operate_user.id ? t('你') : data.operate_user.nickname
            else return false
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.revoke{
    color: #576b95;
}
</style>