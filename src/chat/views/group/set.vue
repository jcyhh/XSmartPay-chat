<template>
    <div>
        <chat-nav :title="$t('群设置')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="chatCard">
                <div class="flex jb ac" @click="updateAvatar">
                    <div class="size28">{{ $t('群头像') }}</div>
                    <div class="flex ac">
                        <img :src="avatar" class="avatar img100 mr10">
                        <van-icon name="arrow"></van-icon>
                    </div>
                </div>
                <div class="chatRowLine mt30 mb30"></div>
                <div class="flex jb ac" @click="name='',show=true">
                    <div class="size28">{{ $t('群昵称') }}</div>
                    <div class="flex ac">
                        <div class="size28 mr10">{{ nickname }}</div>
                        <van-icon name="arrow"></van-icon>
                    </div>
                </div>
            </div>

            <div class="chatCard flex jb ac mt20" v-if="role==1">
                <div class="size28">{{ $t('群主转让') }}</div>
                <van-icon name="arrow"></van-icon>
            </div>

            <div class="chatCard flex jb ac mt20" v-if="role==1" @click="jump(`/groupManage/${id}`)">
                <div class="size28">{{ $t('群管理员') }}</div>
                <van-icon name="arrow"></van-icon>
            </div>

            <div class="chatCard mt20">
                <div class="flex jb ac">
                    <div class="size28">{{ $t('群邀请') }}</div>
                    <van-switch v-model="is_invite" :active-color="mainColor" :inactive-color="boxColor" @change="change($event,'is_invite')" />
                </div>
                <div class="gray size24 mt10">{{ $t('开启后，普通群成员也可以邀请他人进群') }}</div>
            </div>

            <div class="chatCard mt20">
                <div class="flex jb ac">
                    <div class="size28">{{ $t('群禁言') }}</div>
                    <van-switch v-model="is_silence" :active-color="mainColor" :inactive-color="boxColor" @change="change($event,'is_silence')" />
                </div>
                <div class="gray size24 mt10">{{ $t('开启后，普通群成员将不可发送消息') }}</div>
            </div>

            <!-- <div class="chatCard mt20">
                <div class="flex jb ac">
                    <div class="size28">添加好友</div>
                    <van-switch v-model="is_add_friend" :active-color="mainColor" :inactive-color="boxColor" @change="change($event,'is_add_friend')"  />
                </div>
                <div class="gray size24 mt10">开启后，普通群成员可点击对方头像添加为好友</div>
            </div> -->

            <div class="chatBtn chatBgRed flex jc ac mt100" v-scale @click="dissolveShow=true" v-if="role==1">{{ $t('解散群聊') }}</div>

        </div>

        <div class="gap30"></div>
        <div class="safeArea"></div>

        <van-popup v-model="show" style="background-color: transparent !important;">
            <div class="chatPop">
                <div class="tc size28">{{ $t('群昵称') }}</div>
                <div class="pl30 pr30 mt30">
                    <div class="inpbox flex jc ac">
                        <input type="text" v-model="name" :placeholder="$t('请输入')" class="flex1 size28 tc">
                    </div>
                </div>
                <div class="chatRowLine mt40"></div>
                <div class="flex ac size30">
                    <div class="flex1 chatPopbtn flex jc ac chatGray" @click="show=false">{{ $t('取消') }}</div>
                    <div class="chatColLine chatPopbtn"></div>
                    <div class="flex1 chatPopbtn flex jc ac chatColor" @click="delayFun(submit)">{{ $t('确定') }}</div>
                </div>
            </div>
        </van-popup> 

        <van-popup v-model="dissolveShow" style="background-color: transparent !important;">
            <chat-ask @cancel="dissolveShow=false" @confirm="dissolve">
                <div class="tc size26">{{ $t('确定要解散群聊吗？') }}</div>
            </chat-ask>
        </van-popup>
    </div>
</template>

<script>
import ChatAsk from '@/chat/components/ChatAsk'
import { boxColor, mainColor } from '@/chat/config';
import { t } from '@/main'
export default {
    components:{
        ChatAsk
    },
    data() {
        return {
            id:'',

            is_add_friend: false,
            is_invite:false,
            is_silence:false,
            avatar:'',
            nickname:'',

            show: false,
            dissolveShow: false,
            name:'',
            role:3,

            mainColor,
            boxColor
        }
    },
    mounted(){
        this.id = this.$route.params.id
        this.loadData()
    },
    methods:{
        loadData(){
            this.$chatApi.get(`/api/chat/user_groups/${this.id}`).then(res=>{
                this.is_add_friend = res.is_silence
                this.is_invite = res.is_invite
                this.is_silence = res.is_silence
                this.avatar = res.avatar
                this.nickname = res.nickname
                this.role = res.role
            }).catch(() => { })
        },
        submit(){
            if(!this.name)return this.toast(t('请输入群昵称'))
            this.$chatApi.put(`/api/chat/groups/${this.id}`,{
                nickname:this.name
            }).then(()=>{
                this.success(t('修改成功'))
                const name = this.name
                this.nickname = name
                this.show = false
            }).catch(() => { })
        },
        updateAvatar(){
            this.$chatApi.upload('/api/uploads', 'upload').then(res=>{
                this.$chatApi.put(`/api/chat/groups/${this.id}`,{
                    avatar:res.url
                }).then(()=>{
                    this.success(t('修改成功'))
                    this.avatar = res.url
                }).catch(() => { })
            }).catch(() => { })
        },
        change(e, key){
            this.$chatApi.put(`/api/chat/groups/${this.id}`,{
                [key]:e ? 1 : 0
            }).then(()=>{
                this.success(t('修改成功'))
            }).catch(() => { })
        },
        dissolveShow(){
            this.$chatApi.del(`/api/chat/groups/${this.id}`).then(()=>{
                this.success(t('解散成功'))
                setTimeout(() => {
                    this.back(-3)
                }, 1200);
            }).catch(() => { })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>