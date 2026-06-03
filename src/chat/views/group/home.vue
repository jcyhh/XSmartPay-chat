<template>
    <div>
        <chat-nav :title="$t('群员主页')">
            <div class="btn flex jc ac" v-scale @click="delayFun(()=>transferShow=true)" v-if="role==1 && selfId!=id">{{ $t('转让群主') }}</div>
        </chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="flex jb ac chatCard">
                <div class="flex ac">
                    <img :src="avatar" class="avatar mr20" @click="lookImg">
                    <div class="size32 mb5">{{ nickname }}</div>
                </div>
                <div class="confrim flex ac" v-scale @click="delayFun(goDetail)" v-if="showAddFriend">{{ $t('加好友') }}</div>
            </div>

            <div class="chatBtn flex jc ac mt30 size28 chatLinear" v-scale @click="setShow=true" v-if="showSetManage">{{ $t('设为群管理') }}</div>
            <div class="chatBtn flex jc ac mt30 size28 chatCardBg" v-scale @click="removeShow=true" v-if="showRemoveManage">{{ $t('移除群管理') }}</div>
            <div class="chatBtn chatBgRed flex jc ac mt30" v-scale @click="delShow=true" v-if="showRemove">{{ $t('踢出群聊') }}</div>

        </div>

        <van-popup v-model="transferShow" style="background-color: transparent !important;">
            <chat-ask @cancel="transferShow=false" @confirm="transfer">
                <div class="tc size26">{{ $t('确定转让群主给该成员吗？') }}</div>
            </chat-ask>
        </van-popup>

        <van-popup v-model="setShow" style="background-color: transparent !important;">
            <chat-ask @cancel="setShow=false" @confirm="setManage(2)">
                <div class="tc size26">{{ $t('确定将该成员设为管理员吗？') }}</div>
            </chat-ask>
        </van-popup>

        <van-popup v-model="removeShow" style="background-color: transparent !important;">
            <chat-ask @cancel="removeShow=false" @confirm="setManage(3)">
                <div class="tc size26">{{ $t('确定要移除管理员身份吗？') }}</div>
            </chat-ask>
        </van-popup>

        <van-popup v-model="delShow" style="background-color: transparent !important;">
            <chat-ask @cancel="delShow=false" @confirm="removeMember">
                <div class="tc size26">{{ $t('确定要移除该成员吗？') }}</div>
            </chat-ask>
        </van-popup>
    </div>
</template>

<script>
import ChatAsk from '@/chat/components/ChatAsk'
import { getUserId } from '@/chat/config'
import { t } from '@/main';
import { ImagePreview } from 'vant';
export default {
    components:{
        ChatAsk
    },
    data() {
        return {
            id:'',
            groupId:'',
            nickname:'',
            avatar:'',

            transferShow: false,
            setShow: false,
            removeShow: false,
            delShow: false,

            isFriend: true, // 成员是否好友
            isManage: false, // 成员是否管理员
            isOwner: false, // 成员是否群主
            role:3, // 自己的身份
            is_add_friend: false, // 是否可以加好友
            selfId:'' // 自己的id
        }
    },
    computed:{
        // 是否展示【加好友】：不是好友 && 可以加好友
        showAddFriend(){
            return !this.isFriend && this.is_add_friend
        },
        // 是否展示【设为群管理】：群主身份 && 该成员不是群管理 && 不是自己
        showSetManage(){
            return this.role==1 && !this.isManage && this.selfId!=this.id
        },
        // 是否展示【移除群管理】：群主身份 && 该成员已是管理员 && 不是自己
        showRemoveManage(){
            return this.role==1 && this.isManage && this.selfId!=this.id
        },
        // 是否展示【踢出群聊】：群主或管理身份 && 该成员
        showRemove(){
            // 自己不能踢自己
            if(this.selfId == this.id) return false
            if(this.role==1){
                // 群主可以踢所有人
                return true
            }else if(this.role==2){
                // 群管理只能踢普通群员，不能踢群管理和群主
                return !this.isManage && !this.isOwner
            }else{
                // 普通群员无权限
                return false
            }
        }
    },
    mounted(){
        this.selfId = getUserId()

        const {id, nickname, avatar, groupId} = this.$route.query
        this.id = id
        this.nickname = nickname
        this.avatar = avatar
        this.groupId = groupId
        this.loadIsFriend()
        this.loadIsManage()
        this.loadIsOwner()
        this.loadGroup()
    },
    methods:{
        loadGroup(){
            this.$chatApi.get(`/api/chat/user_groups/${this.groupId}`).then(res=>{
                this.role = res.role
                this.is_add_friend = res.is_add_friend
            }).catch(() => { })
        },
        loadIsFriend(){
            if(this.id == getUserId()){
                this.isFriend = true
            }else{
                this.$chatApi.get('/api/chat/friends/contacts').then(res=>{
                    this.isFriend = this.getInfo(res.contacts)
                }).catch(() => { })
            }
        },
        getInfo(list){
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].users.length; j++) {
                    if (list[i].users[j].id == this.id) {
                        // return list[i].users[j];
                        return true
                    }
                }
            }
            return false
        },
        loadIsManage(){
            this.$chatApi.get('/api/chat/group_users',{
                page_no: 1,
                page_size: 50,
                group_id: this.groupId,
                role: 2,
                keyword:''
            }).then(res=>{
                this.isManage = res.group_users.findIndex(item=>item.id==this.id) >= 0
            }).catch(() => { })
        },
        loadIsOwner(){
            this.$chatApi.get('/api/chat/group_users',{
                page_no: 1,
                page_size: 50,
                group_id: this.groupId,
                role: 1,
                keyword:''
            }).then(res=>{
                this.isOwner = res.group_users.findIndex(item=>item.id==this.id) >= 0
            }).catch(() => { })
        },
        goDetail(){
            this.$router.push({
                path:'/friendAdd',
                query: {
                    id: this.id,
                    nickname: this.nickname,
                    avatar: this.avatar
                }
            })
        },
        setManage(role){
            this.$chatApi.post('/api/chat/group_users/set_admin',{
                group_id:this.groupId,
                users: [{id: this.id}],
                role
            }).then(()=>{
                this.success(t('操作成功'))
                this.setShow = false
                this.removeShow = false
                this.loadIsManage()
            }).catch(() => { })
        },
        removeMember(){
            this.$chatApi.post('/api/chat/group_users/kick_out',{
                group_id:this.groupId,
                users: [{id: this.id}]
            }).then(()=>{
                this.success(t('操作成功'))
                this.delShow = false
                setTimeout(() => {
                    this.back()
                }, 1200);
            }).catch(() => { })
        },
        transfer(){
            this.$chatApi.post(`/api/chat/group_users/${this.id}/transfer_owner`,{
                group_id:this.groupId
            }).then(()=>{
                this.success(t('转让成功'))
                this.transferShow = false
                setTimeout(() => {
                    this.back()
                }, 1200);
            }).catch(() => { })
        },
        lookImg(){
            ImagePreview([this.avatar])
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.avatar{
    width: 100px;
    height: 100px;
}
.confrim{
    background-color: rgba($color: $chat-color, $alpha: 0.2);
    color: $chat-color;
    min-width: 120px;
    height: 52px;
    border-radius: 26px;
    padding: 0 26px;
    font-size: 24px;
}
.btn{
    min-width: 120px;
    height: 52px;
    border-radius: 10px;
    background-color: $chat-color;
    color: $chat-btn-txt-color;
    font-size: 26px;
    padding: 0 20px;
}
</style>