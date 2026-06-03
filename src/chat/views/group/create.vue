<template>
    <div>
        <chat-nav :title="$t('创建群聊')">
            <div class="btn flex jc ac" v-scale @click="delayFun(submit)">{{ $t('确定') }}</div>
        </chat-nav>

        <div class="pl30 pr30">

            <van-checkbox-group :checked-color="mainColor" v-model="result">
                <chat-list :paging="false" api="/api/chat/friends/contacts" listKey="contacts"
                    minHeight="calc(100vh - 1.46rem)" v-slot="{ list }">

                    <van-index-bar>
                        <div v-for="data in list" :key="data.key">
                            <van-index-anchor :index="data.key"/>
                            <div class="card">
                                <van-checkbox :name="item.id" v-for="item in data.users" :key="item.id">
                                    <div class="flex ac pt20 pb20 pl10">
                                        <img v-lazy="item.avatar" class="avatar mr30">
                                        <div class="size30 chatTextColor">{{ item.remark || item.nickname }}</div>
                                    </div>
                                </van-checkbox>
                            </div>
                        </div>
                    </van-index-bar>

                </chat-list>
            </van-checkbox-group>

        </div>

        <van-popup v-model="show" style="background-color: transparent !important;">
            <div class="chatPop">
                <div class="tc size28">{{ $t('群名称') }}</div>
                <div class="pl30 pr30 mt30">
                    <div class="inpbox flex jc ac">
                        <input type="text" v-model="nickname" :placeholder="$t('请输入群名称')" class="flex1 size28 tc">
                    </div>
                </div>
                <div class="chatRowLine mt40"></div>
                <div class="flex ac size30">
                    <div class="flex1 chatPopbtn flex jc ac chatGray" @click="show=false">{{ $t('取消') }}</div>
                    <div class="chatColLine chatPopbtn"></div>
                    <div class="flex1 chatPopbtn flex jc ac chatColor" @click="delayFun(create)">{{ $t('确定') }}</div>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script>
import { mainColor } from '@/chat/config';
import { t } from '@/main'

export default {
    data() {
        return {
            result: [],
            nickname:'',
            show: false
        }
    },
    methods:{
        submit(){
            if(this.result.length==0)return this.toast(t('请选择群成员'))
            this.nickname = ''
            this.show = true
        },
        create(){
            if(!this.nickname)return this.toast(t('请输入群昵称'))
            const arr = this.result.map(item=>{
                return {id:item}
            })
            this.$chatApi.post('/api/chat/groups',{
                nickname: this.nickname,
                users: arr
            }).then(()=>{
                this.success(t('创建成功'))
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
.btn{
    min-width: 120px;
    height: 52px;
    border-radius: 10px;
    background-color: $chat-color;
    color: $chat-btn-txt-color;
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
}
</style>