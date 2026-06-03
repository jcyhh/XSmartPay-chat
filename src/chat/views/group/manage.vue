<template>
    <div>
        <chat-nav :title="$t('群管理')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <chat-list ref="list" api="/api/chat/group_users" listKey="group_users" :param="{ keyword, group_id, role }" v-slot="{list}">
                <div class="chatCard flex jb ac mb20" @click="goMemberHome(item)" v-for="(item,index) in list" :key="index">
                    <div class="flex ac">
                        <img v-lazy="item.avatar" class="avatar">
                        <div class="size30 ml30">{{ item.nickname }}</div>
                    </div>
                    <van-icon name="arrow"></van-icon>
                </div>
            </chat-list>

        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            group_id:'',
            keyword:'',
            role: 2
        }
    },
    beforeMount(){
        this.group_id = this.$route.params.id
    },
    methods:{
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
.avatar{
    width: 76px;
    height: 76px;
}
</style>