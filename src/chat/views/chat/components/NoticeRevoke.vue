<template>
    <div>
        <div class="gap20"></div>
        <div class="flex jc ac size24">
            <div class="revoke mr5">{{ subjectText }}</div>
            <div class="gray">{{ $t('撤回了一条消息') }}</div>
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
import { t } from '@/main';

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
            if(this.message.user_id == this.userId)return t('你')
            else return this.message.nickname
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