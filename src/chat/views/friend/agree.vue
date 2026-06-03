<template>
    <div>
        <chat-nav :title="$t('好友申请')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="chatCard">
                <div class="flex ac">
                    <img :src="avatar" class="avatar mr20">
                    <div class="size30">{{ nickname }}</div>
                </div>
                <div class="chatRowLine mt20 mb25"></div>
                <div class="flex ac">
                    <div class="size28 mr30">{{ $t('设置备注') }}</div>
                    <input type="text" v-model="remark" :placeholder="$t('请设置好友备注')" class="size28 flex1">
                </div>
            </div>

            <div class="chatCard mt20 flex ac">
                <div class="size28 mr30">{{ $t('申请理由') }}</div>
                <div class="size28 flex1">{{ content }}</div>
            </div>

            <div class="chatBtn chatLinear flex jc ac mt40" v-scale @click="delayFun(submit)">{{ $t('同意申请') }}</div>

        </div>
    </div>
</template>

<script>
import { t } from '@/main'

export default {
    data() {
        return {
            id:'',
            nickname:'',
            avatar:'',
            remark:'',
			content:''
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            this.$chatApi.get(`/api/chat/friend_applies/${this.$route.params.id}`).then(res=>{
                this.nickname = res.user.nickname
                this.avatar = res.user.avatar
                this.content = res.content
            }).catch(() => { })
        },
        submit(){
            this.$chatApi.post(`/api/chat/friend_applies/${this.$route.params.id}/pass`,{
                remark:this.remark
            }).then(()=>{
                this.success(t('已添加为好友'))
                setTimeout(() => {
                    this.back()
                }, 1200);
            }).catch(() => { })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.avatar{
    width: 98px;
    height: 98px;
    border-radius: 50%;
}
</style>