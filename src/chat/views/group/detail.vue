<template>
    <div>
        <chat-nav :title="`${$t('群聊信息')} (${info.current_quota || 0})`"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="card">
                <div class="flex jb ac">
                    <div class="size28 chatGrey">{{ $t('群号') }} : {{ info.group_no }}</div>
                    <div class="size24 chatGray">{{ info.current_quota || 0 }} / {{ info.max_quota || 0 }}</div>
                </div>
                <div class="chatRowLine mt16"></div>
                <div class="flex jb ac mt30">
                    <div class="flex ac">
                        <img :src="info.avatar" class="avatar mr20">
                        <div>
                            <div class="size32">{{ info.nickname }}</div>
                            <div class="flex ac chatColor size24 mt10" @click="jump(`/groupSet/${id}`)" v-if="info.role<3">
                                <van-icon name="edit" class="mt5"></van-icon>
                                <div class="ml5">{{ $t('编辑群资料') }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex ac ml30">
                        <img src="@/chat/assets/22.png" class="img100" @click="jump(`/groupRemoveMember/${id}`)" v-if="info.role<3">
                        <img src="@/chat/assets/19.png" class="img100 ml20" @click="jump(`/groupInvite/${id}`)" v-if="info.is_invite || info.role<3">
                    </div>
                </div>
            </div>

            <div class="chatCard mt20 size30">
                <div class="flex jb ac" @click="nickname='', nicknameShow=true">
                    <div>{{ $t('我的群昵称') }}</div>
                    <div class="flex ac">
                        <div class="mr10">{{ info.display_name || '--' }}</div>
                        <div class="chatGrey">
                            <van-icon name="arrow"></van-icon>
                        </div>
                    </div>
                </div>
                <!-- <div @click="jump(`/groupQrcode/${id}`)" v-if="info.is_invite || info.role<3">
                    <div class="chatRowLine mt30 mb30"></div>
                    <div class="flex jb ac">
                        <div>{{ $t('群邀请码') }}</div>
                        <div class="flex ac chatGrey">
                            <van-icon name="qr" size="30"></van-icon>
                            <van-icon name="arrow"></van-icon>
                        </div>
                    </div>
                </div> -->
                <div v-if="info.is_invite || info.role<3">
                    <div class="chatRowLine mt30 mb30"></div>
                    <div class="flex jb ac">
                        <div>{{ $t('群邀请码') }}</div>
                        <div class="flex ac" v-copy="info.invite_code">
                            <div class="mr10">{{ info.invite_code || '--' }}</div>
                            <div class="">
                                <van-icon name="description-o"></van-icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chatRowLine mt30 mb30"></div>
                <div class="flex jb" @click="jump(`/groupMember/${id}`)">
                    <div>{{ $t('群成员') }}</div>
                    <div class="chatGrey">
                        <van-icon name="arrow"></van-icon>
                    </div>
                </div>
                <div class="chatRowLine mt30 mb30" v-if="info.role<3"></div>
                <div class="flex jb" @click="jump(`/groupSet/${id}`)" v-if="info.role<3">
                    <div>{{ $t('群设置') }}</div>
                    <div class="chatGrey">
                        <van-icon name="arrow"></van-icon>
                    </div>
                </div>
            </div>

            <!-- <div class="chatCard mt20 flex jb ac">
                <div class="size28">置顶聊天</div>
                <van-switch v-model="checked" active-color="#36BB57" />
            </div> -->

            <div class="chatBtn chatLinear flex jc ac mt60" v-scale @click="delayFun(goChat)">{{ $t('发消息') }}</div>
            <div class="chatBtn flex jc ac mt30 size28 chatCardBg" v-scale @click="delayFun(()=>quitShow=true)" v-if="info.role > 1">{{ $t('退出群聊') }}</div>

        </div>

        <van-popup v-model="nicknameShow" style="background-color: transparent !important;">
            <div class="chatPop">
                <div class="tc size28">{{ $t('我的本群昵称') }}</div>
                <div class="pl30 pr30 mt30">
                    <div class="inpbox flex jc ac">
                        <input type="text" v-model="nickname" :placeholder="$t('请输入')" class="flex1 size28 tc">
                    </div>
                </div>
                <div class="chatRowLine mt40"></div>
                <div class="flex ac size30">
                    <div class="flex1 chatPopbtn flex jc ac chatGray" @click="nicknameShow=false">{{ $t('取消') }}</div>
                    <div class="chatColLine chatPopbtn"></div>
                    <div class="flex1 chatPopbtn flex jc ac chatColor" @click="delayFun(editNickname)">{{ $t('确定') }}</div>
                </div>
            </div>
        </van-popup>

        <van-popup v-model="quitShow" style="background-color: transparent !important;">
            <chat-ask @cancel="quitShow=false" @confirm="quit">
                <div class="tc size26">{{ $t('确定要退出群聊吗？') }}</div>
            </chat-ask>
        </van-popup>
    </div>
</template>

<script>
import ChatAsk from '@/chat/components/ChatAsk'
import { t } from '@/main'
export default {
    components:{
        ChatAsk
    },
    data() {
        return {
            id:'',
            show: false,
            quitShow: false,
            nicknameShow: false,
            checked: false,
            info:{},
            nickname:''
        }
    },
    mounted(){
        this.id = this.$route.params.id
        this.loadData()
    },
    methods:{
        loadData(){
            this.$chatApi.get(`/api/chat/user_groups/${this.id}`).then(res=>{
                this.info = res
            }).catch(() => { })
        },
        editNickname(){
            if(!this.nickname)return this.toast(t('请输入昵称'))
            this.$chatApi.put(`/api/chat/user_groups/${this.id}`,{
                remark: this.nickname
            }).then(()=>{
                const name = this.nickname
                this.info.display_name = name
                this.nicknameShow = false
                this.success(t('修改成功'))
            }).catch(() => { })
        },
        quit(){
            this.$chatApi.del(`/api/chat/user_groups/${this.id}`).then(()=>{
                this.success(t('退出成功'))
                const isFromChat = this.$route.query.isFromChat
                setTimeout(() => {
                    this.back(isFromChat ? -2 : -1)
                }, 1200);
            }).catch(() => { })
        },
        // 添加路由栈或者返回，避免两个页面一直叠加路由栈
        goChat(){
            const isFromChat = this.$route.query.isFromChat
            if(isFromChat){
                this.back()
            }else{
                this.$router.push({
                    path:`/group/${this.id}`,
                    query: {
                        isFromHome: true
                    }
                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.card{
    padding: 30px;
    background-color: $chat-card-bg;
    border-radius: 20px;
    .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
}
.headimg{
    width: 50px;
    height: 50;
    border-radius: 50%;
}
</style>