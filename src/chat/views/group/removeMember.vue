<template>
    <div>
        <chat-nav :title="$t('移除群成员')">
            <div class="btn flex jc ac" v-scale @click="delayFun(submit)">{{ $t('确定') }}</div>
        </chat-nav>

        <div class="pl30 pr30">

            <chat-list ref="list" api="/api/chat/group_users" listKey="group_users" :param="{ keyword, group_id }" v-slot="{list}">
                <van-checkbox-group :checked-color="mainColor" v-model="result">
                    <div class="mb20" v-for="item in list" :key="item.id">
                        <div class="card" v-if="item.id != userId">
                            <van-checkbox :name="item.id">
                                <div class="flex ac pt20 pb20 pl10">
                                    <img v-lazy="item.avatar" class="avatar img76 mr30">
                                    <div class="size30 chatTextColor">{{ item.remark || item.nickname }}</div>
                                </div>
                            </van-checkbox>
                        </div>
                    </div>
                </van-checkbox-group>
            </chat-list>

        </div>
    </div>
</template>

<script>
import { getUserId, mainColor } from '@/chat/config'
import { t } from '@/main'
export default {
    data(){
        return {
            userId:'',

            group_id:'',
            keyword:'',

            result:[]
        }
    },
    beforeMount(){
        this.group_id = this.$route.params.id
        this.userId = getUserId()
    },
    methods:{
        submit(){
            if(this.result.length==0)return this.toast(t('请选择成员'))
            const arr = this.result.map(item=>{
                return {id: item}
            })
            this.$chatApi.post('/api/chat/group_users/kick_out',{
                group_id: this.group_id,
                users: arr
            }).then(()=>{
                this.success(t('移除成功'))
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
    color: #FFFFFF;
    font-size: 26px;
}
.card{
    padding: 0 30px;
    background-color: $chat-card-bg;
    border-radius: 20px;
}
</style>