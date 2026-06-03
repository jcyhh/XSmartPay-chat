<template>
    <div>
        <van-popup v-model="show"></van-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false
        }
    },
    methods:{
        open(){

        },
        close(){
            
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
</style>