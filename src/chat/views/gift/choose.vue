<template>
    <div>
        <chat-nav :title="$t('指定领取人')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="chooseSearch flex ac">
                <i class="el-icon-search size30 gray mr30"></i>
                <input type="text" :placeholder="$t('搜索')" class="flex1 size28">
            </div>

            <van-index-bar>
                <van-index-anchor index="A" />
                <div class="card">
                    <div class="flex ac pt20 pb20" v-for="(item,index) in 3" :key="index">
                        <img src="@/assets/avatar.png" class="avatar mr30">
                        <div class="size30">昵称</div>
                    </div>
                </div>

                <van-index-anchor index="B" />
                <div class="card">
                    <div class="flex ac pt20 pb20" v-for="(item,index) in 3" :key="index">
                        <img src="@/assets/avatar.png" class="avatar mr30">
                        <div class="size30">昵称</div>
                    </div>
                </div>

            </van-index-bar>

        </div>

    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chooseSearch {
    width: 100%;
    height: .68rem;
    border-radius: .34rem;
    background-color: $chat-card-bg;
    padding: 0 .3rem;
    position: sticky;
    top: 1.3rem;
    left: 0;
    z-index: 10;
}
.card{
    padding: 0 .3rem;
    background-color: $chat-card-bg;
    border-radius: .2rem;
    .avatar{
        width: .76rem;
        height: .76rem;
        border-radius: 50%;
    }
}
</style>