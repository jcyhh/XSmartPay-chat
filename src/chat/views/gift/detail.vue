<template>
    <div class="page">
        <div class="navHead">
            <img src="@/assets/chat/14.png" class="bg">
            <div class="navBack flex jc ac" @click="back">
                <i class="el-icon-arrow-left size50"></i>
            </div>
            <div class="gap160"></div>

            <div class="flex col ac">
                <img src="@/assets/avatar.png" class="avatar">
                <div class="size32 bold mt20 rel flex ac">
                    某某某发出的红包
                    <div class="tag">拼手气</div>
                </div>
                <div class="size26 gray mt20 pl60 pr60 tc">恭喜发财，大吉大利</div>
                <div class="size0 red mt30">
                    <span class="size80 bold">8.88</span>
                    <span class="size26 ml10">元</span>
                </div>
            </div>

            <div class="pl40 pr40 mt60">
                <div class="box flex ac">领取进度：0 / 10</div>
            </div>
        </div>
        
        <div class="pl40 pr40 mt10">
            <div class="listItem flex ac" v-for="(item,index) in 3" :key="index">
                <img src="@/assets/avatar.png" class="listAvatar mr20">
                <div class="flex1">
                    <div class="flex jb size30">
                        <div>昵称</div>
                        <div>3.00 元</div>
                    </div>
                    <div class="flex jb ac mt10">
                        <div class="size24 gray">12:30</div>
                        <div class="flex ac">
                            <img src="@/assets/chat/15.png" class="icon15">
                            <div class="tip ml5">手气最佳</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.page{
    width: 100vw;
    min-height: 100vh;
    background-color: #FFFFFF;
}
.navHead{
    width: 100vw;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 10;
    .navBack{
        width: 1rem;
        height: 1rem;
        position: absolute;
        left: 0;
        top: .3rem;
    }
    .bg{
        width: 100vw;
        height: 2.15rem;
        position: absolute;
        top: 0;
        left: 0;
    }
}
.avatar{
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    position: relative;
    z-index: 1;
}
.tag{
    height: .36rem;
    background-color: #FFF1EE;
    border-radius: .2rem;
    color: #FF6840;
    font-size: .24rem;
    padding: 0 .1rem;
    line-height: .36rem;
    position: absolute;
    left: calc(100% + .2rem);
    white-space: nowrap;
}
.box{
    height: .68rem;
    border-radius: .1rem;
    background-color: #F3F4F5;
    padding: 0 .2rem;
    color: #666666;
    font-size: .26rem;
}
.listItem{
    border-bottom: 0.01rem solid #F3F3F3;
    padding: .3rem 0 .2rem 0;
    .listAvatar{
        width: .84rem;
        height: .84rem;
        border-radius: 50%;
    }
    .icon15{
        width: .25rem;
        height: .2rem;
    }
    .tip{
        color: #FFB72E;
        font-size: .24rem;
    }
}
</style>