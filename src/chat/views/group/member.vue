<template>
    <div>
        <chat-nav :title="$t('群成员')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="search flex ac size28">
                <van-icon name="search"></van-icon>
                <input type="text" v-model="keyword" :placeholder="$t('输入关键字搜索')" class="flex1 ml30" @input="delayFun(search)">
            </div>

            <chat-list ref="list" api="/api/chat/group_users" listKey="group_users" :param="{ keyword, group_id }" v-slot="{list}">
                <div class="chatCard mt20 card" v-if="list.length>0">
                    <div class="flex jc ac col" @click="goMemberHome(item)" v-for="(item,index) in list" :key="index">
                        <img v-lazy="item.avatar" class="avatar mb10">
                        <div class="line1 nickname size26 gray">{{ item.nickname }}</div>
                    </div>
                </div>
            </chat-list>
            
            <div class="gap30"></div>
            <div class="safeArea"></div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            group_id:'',
            keyword:''
        }
    },
    beforeMount(){
        this.group_id = this.$route.params.id
    },
    methods:{
        search(){
            this.$nextTick(()=>{
                this.$refs.list.refresh()
            })
        },
        goMemberHome(data){
            this.$router.push({
                path:'/groupHome',
                query: {
                    id: data.id,
                    nickname: data.nickname,
                    avatar: data.avatar,
                    groupId: this.group_id
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
.card{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    .avatar{
        width: 100px;
        height: 100px;
        display: block;
    }
    .nickname{
        width: 135px;
        text-align: center;
    }
}
</style>