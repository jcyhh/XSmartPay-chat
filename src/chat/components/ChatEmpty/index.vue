<template>
    <div>
        <div class="chatEmptyGap"></div>
        <div class="ChatEmpty">
            <img src="@/chat/assets/nodata.png" class="ChatEmptyNodata animate__animated animate__fadeIn"> 
        </div>
    </div>
</template>

<script>
/**
 * @name CusEmpty
 * @description 空数据占位
 */
export default {
    name:'CusEmpty'
}
</script>

<style scoped>
.chatEmptyGap{
    width: 100%;
    height: 100px;
}
.ChatEmpty{
    display: flex;
    justify-content: center;
}
.ChatEmptyNodata{
    width: 200px;
    height: 200px;
}
</style>