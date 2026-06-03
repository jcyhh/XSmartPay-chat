<template>
    <div>
        <chat-nav :title="$t('添加群聊')"></chat-nav>

        <div class="pl30 pr30 mt30">
            <chat-list :paging="false" api="/api/chat/groups" listKey="groups" v-slot="{ list }">
                <div class="chatCard flex jb ac mt20" v-for="(item,index) in list" :key="index">
                    <div class="flex ac">
                        <img v-lazy="item.avatar" class="avatar mr20">
                        <div class="size30">{{ item.nickname }}</div>
                    </div>
                    <div class="btn flex jc ac" v-scale @click="delayFun(jump, `/groupJoin/${item.id}`)">{{ $t('加入群聊') }}</div>
                </div>
            </chat-list>
        </div>

    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.avatar{
    width: 76px;
    height: 76px;
    border-radius: 50%;
}
.btn{
    min-width: 164px;
    height: 58px;
    border-radius: 29px;
    background-color: $chat-color;
    color: #FFFFFF;
    font-size: 28px;
    padding: 0 28px;
}
</style>