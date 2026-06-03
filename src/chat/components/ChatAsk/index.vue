<template>
    <div class="chatPop">
        <div class="tc size30">{{ $t('提示') }}</div>
        <div class="mt30">
            <slot></slot>
        </div>
        <div class="chatRowLine mt40"></div>
        <div class="flex ac size30">
            <div class="flex1 chatPopbtn flex jc ac gray" @click="cancel">{{ $t('取消') }}</div>
            <div class="chatColLine chatPopbtn"></div>
            <div class="flex1 chatPopbtn flex jc ac chatColor" @click="confirm">{{ $t('确定') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>