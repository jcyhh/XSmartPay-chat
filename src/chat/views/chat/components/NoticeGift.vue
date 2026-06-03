<template>
    <div>
        <div class="gap20"></div>
        <div class="flex jc ac size24">
            <img src="@/chat/assets/12.png" class="icon12 mr8">
            <div class="gray">某某某</div>
            <div class="gray">{{ $t('领取了') }}</div>
            <div class="gray">某某某的</div>
            <div class="red">{{ $t('红包') }}</div>
        </div>
        <div class="gap20"></div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.icon12{
    width: 22px;
    height: 25.5px;
}
</style>