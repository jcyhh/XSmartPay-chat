<template>
    <div>
        <chat-nav :title="$t('添加好友')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="search flex ac size28">
                <van-icon name="search"></van-icon>
                <input type="text" v-model="keyword" :placeholder="$t('请输入用户ID')" class="flex1 ml30" @input="delayFun(search)">
            </div>

            <van-list :style="{minHeight:'calc(100vh - 1.18rem)'}" v-model="loading" :finished="finished" :finished-text="$t('没有更多了')" :immediate-check="false" @load="onLoad">
                <div class="chatCard flex jb ac mt20" @click="goDetail(item)" v-for="(item,index) in list" :key="index">
                    <div class="flex ac">
                        <img v-lazy="item.avatar" class="avatar mr20">
                        <div class="size30">{{ item.nickname }}</div>
                    </div>
                    <van-icon name="arrow"></van-icon>
                </div>
                <cus-empty v-if="list.length==0"></cus-empty>
            </van-list>

        </div>
    </div>
</template>

<script>
let allList = []
export default {
    data(){
        return{
            keyword: '',
            list: [],
            page:0,
            limit: 10,
            loading:false,
            finished:false
        }
    },
    methods:{
        search(){
            if(!this.keyword){
                this.list = []
                return
            }
            this.page = 0
			this.list = []
            this.finished = false
            this.loading = true
            this.$chatApi.get('/api/chat/users/search',{
                keyword:this.keyword
            }).then(res=>{
                allList= res.users.filter(e=>{
                    return !e.is_friend || e.is_friend==false
                })
                this.onLoad()
            }).catch(() => { })
        },
        // 接口没有分页，自行处理分页
        onLoad(){
            this.page++
            this.loading = true
            let start = this.page * this.limit - this.limit
            let end = this.page * this.limit
            let arr = allList.slice(start, end)
            this.list = this.list.concat(arr)
            this.loading = false
            this.finished = this.list.length==allList.length
        },
        // 没有详情接口，需拼数据跳转
        goDetail(data){
            this.$router.replace({
                path:'/friendAdd',
                query: {
                    id: data.id,
                    nickname: data.nickname,
                    avatar: data.avatar
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.search{
    height: 68px;
    border-radius: 34px;
    background-color: $chat-card-bg;
    padding: 0 30px;
}
.avatar{
    width: 76px;
    height: 76px;
    border-radius: 50%;
}
</style>