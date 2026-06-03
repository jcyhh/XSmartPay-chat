<template>
    <div>
        <div class="navbar flex ac" :style="{background:`rgba(0,0,0,${opacity})`}">
            <div class="flex1 flex ac" @click="navback">
                <img src="@/chat/assets/back.png" class="img40" v-if="showBack">
            </div>
            <div class="flex2 tc bold size32">{{ title }}</div>
            <div class="flex1 flex je ac">
                <slot></slot>
            </div>
        </div>
        <div class="gap100" v-if="!scroll"></div>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            type: String,
            default:''
        },
        scroll:{
            type: Boolean,
            default: false
        },
        showBack:{
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            opacity:1
        }
    },
    mounted(){
        if(this.scroll){
            this.opacity = 0
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    beforeDestroy(){
        if(this.scroll){
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    methods:{
        handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const opacity = Math.min(scrollTop / 300, 1); // 根据滚动距离计算透明度
            if (this.opacity != opacity) {
                this.opacity = opacity;
            }
        },
        navback(){
            if(this.showBack){
                // this.back()
                window.parent.postMessage({
                    type:'back',
                    data:''
                },'*')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.navbar{
    width: 100vw;
    height: 100px;
    background-color: $chat-nav-bg;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0 30px;
}
</style>