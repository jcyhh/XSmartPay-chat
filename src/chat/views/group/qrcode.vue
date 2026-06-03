<template>
    <div>
        <chat-nav :title="$t('群二维码')"></chat-nav>

        <div class="pl30 pr30 mt40">

            <div class="chatCard">
                <div class="gap30"></div>
                <div class="flex col ac">
                    <img :src="avatar" class="img100 avatar">
                    <div class="size28 mt30">{{ nickname }}</div>
                    <div class="chatGray size24 mt60 mb30">{{ $t('请扫描下方二维码进群') }}</div>
                    <canvas v-qrcode:350_10="qrcodeText"></canvas>
                </div>
                <div class="chatBtn chatLinear flex jc ac mt100" v-scale v-copy="shareUrl">{{ $t('复制邀请链接') }}</div>
                <div class="gap30"></div>
            </div>

        </div>
    </div>
</template>

<script>
import { publicPath } from '@/chat/config'
export default {
    data(){
        return{
            id:'',

            avatar: '',
            nickname: '',
            invite_code: ''
        }
    },
    computed:{
        qrcodeText(){
            return `?QRtype=group&receiverId=${this.id}&inviteCode=${this.invite_code}`
        },
        shareUrl(){
            return `${window.location.origin}${publicPath}groupJoin/${this.id}`
        }
    },
    mounted(){
        this.id = this.$route.params.id
        this.loadData()
    },
    methods:{
        loadData(){
            this.$chatApi.get(`/api/chat/user_groups/${this.id}`).then(res=>{
                this.avatar = res.avatar
                this.nickname = res.nickname
                this.invite_code = res.invite_code
            }).catch(() => { })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>