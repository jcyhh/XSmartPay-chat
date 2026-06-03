<template>
    <div>
        <van-popup v-model="show" style="background-color: transparent !important;">
            <div class="giftContainer flex jc ac">
                <div class="giftpopCard" :class="flag?'giftpopChange':''">
                    <div class="giftpopFront flex col jb ac">
                        <div class="flex col ac">
                            <div class="flex ac">
                                <img src="@/chat/assets/avatar.png" class="giftpopAvatar">
                                <div class="ml16 size26">某某某 {{ $t('发出的红包') }}</div>
                            </div>
                            <div class="size40 tc mt48 lh70">恭喜发财，大吉大利</div>
                        </div>
                        <img src="@/chat/assets/16.png" class="giftpopOpen" v-scale @click="delayFun(submit)">
                    </div>
                    <div class="giftpopBack flex col jb ac giftpopHidden">
                        <div class="flex col ac">
                            <div class="flex ac">
                                <img src="@/chat/assets/avatar.png" class="giftpopAvatar">
                                <div class="ml16 size26">某某某 {{ $t('发出的红包') }}</div>
                            </div>
                            <div class="size40 tc mt48 lh70">恭喜发财，大吉大利</div>
                        </div>
                        <div class="flex ac size24" @click="jump('/giftDetail')">
                            <div class="mr15">{{ $t('查看红包详情') }}</div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            flag: false
        }
    },
    methods: {
        open() {
            this.flag = false
            this.show = true
        },
        close() {
            this.show = false
        },
        submit() {

            this.flag = true
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.giftpopAvatar{
    width: 64px;
    height: 64px;
    border-radius: 50%;
}
.giftpopOpen{
    width: 174px;
    height: 174px;
}
.giftContainer {
    perspective: 1000px;
    width: 100vw;
    height: 1000px;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
}

.giftpopCard {
    width: 550px;
    height: 904px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s ease;
}

.giftpopChange {
    transform: rotateY(180deg);
}

.giftpopFront,
.giftpopBack {
    width: 550px;
    height: 904px;
    background-image: url('@/chat/assets/13.png');
    background-size: 100% 100%;
    padding: 130px 60px 100px 60px;
    position: absolute;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    color: white;
}

.giftpopHidden {
    transform: rotateY(180deg);
}
</style>