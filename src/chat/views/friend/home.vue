<template>
    <div>
        <chat-nav :title="$t('好友信息')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="chatCard">
                <div class="flex ac">
                    <img :src="avatar" class="avatar mr20" @click="lookImg">
                    <div class="size30">{{ nickname }}</div>
                </div>
                <div class="chatRowLine mt20 mb25"></div>
                <div class="flex ac">
                    <div class="size28 mr30">{{ $t('设置备注') }}</div>
                    <input type="text" v-model="remark" :placeholder="$t('请设置好友备注')" class="size28 flex1" @keyup.enter="editRemark">
                </div>
            </div>

            <!-- <div class="chatBtn chatLinear flex jc ac mt60" v-scale @click="delayFun(jump, `/friend/${$route.params.id}`)">发消息</div> -->
            <div class="chatBtn chatLinear flex jc ac mt60" v-scale @click="delayFun(goChat)">{{ $t('发消息') }}</div>
            <div class="chatBtn flex jc ac mt30 size28 chatCardBg" v-scale @click="delayFun(()=>show=true)">{{ $t('删除好友') }}</div>

        </div>

        <van-popup v-model="show" style="background-color: transparent !important;">
            <chat-ask @cancel="show=false" @confirm="delFriend">
                <div class="tc size26">{{ $t('确定要删除好友吗？') }}</div>
            </chat-ask>
        </van-popup>
    </div>
</template>

<script>
import ChatAsk from '@/chat/components/ChatAsk'
import { t } from '@/main';
import { ImagePreview } from 'vant';
export default {
    components:{
        ChatAsk
    },
    data() {
        return {
            show: false,

            nickname:'',
            remark:'',
            avatar:''
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            this.$chatApi.get(`/api/chat/friends/${this.$route.params.id}`).then(res=>{
                this.avatar = res.avatar
                this.remark = res.remark
                this.nickname = res.nickname
            }).catch(() => { })
        },
        lookImg(){
            ImagePreview([this.avatar])
        },
        // 添加路由栈或者返回，避免两个页面一直叠加路由栈
        goChat(){
            const isFromChat = this.$route.query.isFromChat
            if(isFromChat){
                this.back()
            }else{
                this.$router.push({
                    path:`/friend/${this.$route.params.id}`,
                    query: {
                        isFromHome: true
                    }
                })
            }
        },
        editRemark(){
            this.$chatApi.put(`/api/chat/friends/${this.$route.params.id}`,{
                remark: this.remark
            }).then(()=>{
                this.toast(t('备注修改成功'))
            }).catch(() => { })
        },
        delFriend(){
            this.show = false
            this.$chatApi.del(`/api/chat/friends/${this.$route.params.id}`).then(()=>{
                this.toast(t('好友删除成功'))
                this.back()
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