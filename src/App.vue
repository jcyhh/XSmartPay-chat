<template>
    <div id="app">
        <transition :enter-active-class="enterClass" :leave-active-class="leaveClass" mode="out-in">
            <router-view></router-view>
        </transition>

        <!-- 全局消息通知 -->
        <chat-notice ref="chatNotice"></chat-notice>
    </div>
</template>

<script>
import ChatNotice from "@/chat/components/ChatNotice";
export default {
    name: "App",
    components: {
        ChatNotice,
    },
    data() {
        return {
            enterClass: "",
            leaveClass: "",
        };
    },
    watch: {
        $route(to, from) {
            // 设置进入动画
            this.enterClass = to.meta.transition?.enter || "";
            // 设置离开动画
            this.leaveClass = from.meta.transition?.leave || "";
        },
    },
    mounted() {
        this.$store.dispatch("chat/initSocket");
        this.$bus.$on('notice', (content) => {
            this.$refs.chatNotice.open(content)
        });
    },
};
</script>

<style lang="scss"></style>
