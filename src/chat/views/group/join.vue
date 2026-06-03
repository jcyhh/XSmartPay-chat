<template>
    <div>
        <chat-nav :title="$t('加入群聊')"></chat-nav>

        <div class="pl30 pr30 mt40">

            <div class="chatCard">
                <div class="flex jb ac">
                    <div class="size28">{{ $t('群头像') }}</div>
                    <img :src="avatar" class="avatar img100">
                </div>
                <div class="chatRowLine mt30 mb30"></div>
                <div class="flex jb ac">
                    <div class="size28">{{ $t('群昵称') }}</div>
                    <div class="size28">{{ nickname }}</div>
                </div>
            </div>

            <div class="chatBtn chatLinear flex jc ac mt100" v-scale @click="delayFun(submit)">{{ $t('加入') }}</div>

        </div>
    </div>
</template>

<script>
import { t } from '@/main'

export default {
    data(){
        return{
            id:'',

            avatar: '',
            nickname: '',
            invite_code: ''
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
        },
        submit(){
            this.$chatApi.post('/api/chat/user_groups',{
                invite_code:this.invite_code
            }).then(()=>{
                this.success(t('加入成功'))
                setTimeout(() => {
                    this.back()
                }, 1200);
            }).catch(()=>{})
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>