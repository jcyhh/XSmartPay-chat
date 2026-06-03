<template>
    <div>
        <chat-nav :title="$t('群聊列表')"></chat-nav>

        <chat-list api="/api/chat/user_groups" listKey="user_groups" v-slot="{list}">
            <div class="pl30 pr30 mt30">
                <div class="card" v-if="list.length>0">
                    <div class="flex ac" v-for="(item,index) in list" :key="index" @click="jump(`/groupDetail/${item.id}`)">
                        <img v-lazy="item.avatar" class="avatar mr30">
                        <div class="flex1">
                            <div class="gap30"></div>
                            <div class="flex jb ac">
                                <div class="size30">{{item.nickname}}</div>
                                <van-icon name="arrow"></van-icon>
                            </div>
                            <div class="gap30"></div>
                            <div class="chatRowLine" v-if="index!=list.length-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </chat-list>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.card{
    padding: 20px 30px;
    background-color: $chat-card-bg;
    border-radius: 20px;
    .avatar{
        width: 76px;
        height: 76px;
        border-radius: 50%;
    }
}
</style>