<template>
    <div>
        <chat-nav :title="$t('邀请进群')">
            <div class="btn flex jc ac" v-scale @click="delayFun(submit)">{{ $t('确定') }}</div>
        </chat-nav>

        <div class="pl30 pr30">

            <van-checkbox-group :checked-color="mainColor" v-model="result">
                <van-index-bar>
                    <div v-for="data in list" :key="data.key">
                        <van-index-anchor :index="data.key"/>
                        <div class="card">
                            <van-checkbox :disabled="item.alreadyIn" :name="item.id" v-for="item in data.users" :key="item.id">
                                <div class="flex ac pt20 pb20 pl10">
                                    <div class="flex ac">
                                        <img v-lazy="item.avatar" class="avatar mr30">
                                        <div class="size30 chatTextColor">{{ item.remark || item.nickname }}</div>
                                    </div>
                                    <div class="tag chatGray flex ac ml30" v-if="item.alreadyIn">{{ $t('已入群') }}</div>
                                </div>
                            </van-checkbox>
                        </div>
                    </div>
                </van-index-bar>
            </van-checkbox-group>

        </div>

    </div>
</template>

<script>
import { mainColor } from '@/chat/config';
import { t } from '@/main';
import { Toast } from 'vant';
export default {
    data() {
        return {
            id:'',
            page:1,
            limit:10,
            members:[],

            list:[],
            result: [],
            show: false
        }
    },
    mounted(){
        this.id = this.$route.params.id
        this.loadMember()
    },
    methods:{
        loadMember(){
            Toast.loading({
                forbidClick: true,
            });
            this.$chatApi.get('/api/chat/group_users',{
                page_no: this.page,
                page_size: this.limit,
                keyword:'',
                group_id: this.id
            }).then(res=>{
                const list = res.group_users
                if(list.length>0){
                    this.members = this.members.concat(list)
                    if(list.length==this.limit){
                        this.page++
                        this.loadMember()
                    }else{
                        this.loadList()
                    }
                }else{
                    this.loadList()
                }
            }).catch(() => { })
        },
        loadList(){
            this.$chatApi.get('/api/chat/friends/contacts').then(res => {
                if (res.contacts.length > 0) {
                    const list = res.contacts
                    list.forEach((e, i) => {
                        e.users.forEach((item, index) => {
                            const info = this.members.findIndex(member=>member.id == item.id)
                            if(info>=0){
                                item['alreadyIn'] = true
                                this.result.push(item.id)
                            }
                        })
                    })
                    this.list = list
                }
                Toast.clear()
            }).catch(() => { })
        },
        submit(){
            let arr = this.result.filter(item=>{
                return this.members.findIndex(member=>member.id==item) < 0
            })
            if(arr.length==0)return this.toast(t('请选择成员'))
            arr = arr.map(item=>{
                return {id: item}
            })
            this.$chatApi.post('/api/chat/group_users/invite', {
                group_id: this.id,
                users: arr
            }).then(()=>{
                this.success(t('邀请成功'))
                setTimeout(() => {
                    this.back()
                }, 1200);
            }).catch(() => { })
        },
        hasIn(id){
            const list = this.list
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].users.length; j++) {
                    if (list[i].users[j].id == id) {
                        return true
                    }
                }
            }
            return false
        },
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.btn{
    min-width: 120px;
    height: 52px;
    border-radius: 10px;
    background-color: $chat-color;
    color: #FFFFFF;
    font-size: 26px;
}
.card{
    padding: 0 30px;
    background-color: $chat-card-bg;
    border-radius: 20px;
    .avatar{
        width: 76px;
        height: 76px;
        border-radius: 50%;
    }
    .tag{
        background-color: $chat-card-box-bg;
        min-width: 120px;
        height: 52px;
        border-radius: 26px;
        padding: 0 26px;
        font-size: 24px;
    }
}
</style>