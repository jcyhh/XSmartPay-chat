<template>
    <div>
        <chat-nav :title="$t('好友列表')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="card">
                <div class="flex jb ac pt20 pb20" @click="jump('/friendApply')">
                    <div class="flex ac">
                        <img src="@/chat/assets/17.png" class="avatar mr30">
                        <div class="size30">{{ $t('新的朋友') }}</div>
                    </div>
                    <div class="dot" v-if="applyCount>0"></div>
                </div>
                <div class="flex ac pt20 pb20" @click="jump('/groups')">
                    <img src="@/chat/assets/18.png" class="avatar mr30">
                    <div class="size30">{{ $t('群聊') }}</div>
                </div>
            </div>

            <chat-list :paging="false" api="/api/chat/friends/contacts" listKey="contacts"
                minHeight="calc(100vh - 1.46rem)" v-slot="{ list }">

                <van-index-bar>
                    <div v-for="data in list" :key="data.key">
                        <van-index-anchor :index="data.key"/>
                        <div class="card">
                            <div class="flex ac pt20 pb20" @click="jump(`/friendHome/${item.id}`)" v-for="item in data.users" :key="item.id">
                                <img v-lazy="item.avatar" class="avatar mr30">
                                <div class="size30">{{ item.remark || item.nickname }}</div>
                            </div>
                        </div>
                    </div>
                </van-index-bar>

            </chat-list>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            applyCount: 0
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            // 好友申请数量
            this.$chatApi.get('/api/chat/friend_applies/pending_count').then(res=>{
                this.applyCount = res.pending_count
            }).catch(()=>{})
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.card{
    padding: 0 30px;
    background-color: $chat-card-bg;
    border-radius: 20px;
    .avatar{
        width: 76px;
        height: 76px;
        border-radius: 50%;
    }
    .dot{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: $chat-color;
    }
}
</style>