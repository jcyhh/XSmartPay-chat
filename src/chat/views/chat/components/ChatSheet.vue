<template>
    <div class="chatSheet flex ac" :class="{
        'showSheet': show && !self,
        'hideSheet': !show && !self,
        'hideSelfSheet': !show && self,
        'showSelfSheet': show && self
    }" :style="styles">
        <div class="chatSheetRect" :class="self?'selftRect':'rect'"></div>
        <div class="flex col ac pl30 pr30" v-for="(item,index) in list" :key="index" @click="tabClick(item.value)">
            <van-icon :name="item.icon"></van-icon>
            <div class="size22 mt10">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
import { computedSub, computedMul, computedDiv, initRichText } from '@/chat/utils'
import { t } from '@/main';
import copy from 'copy-to-clipboard';
export default {
    props:{
        talkType:{
            type:Number,
            default:1
        },
        toId:{
            type:[Number, String],
            default:''
        }
    },
    data(){
        return {
            list:[], // 选项列表
            show:false, // 是否显示弹窗
            self:false, // 是否是在自己这一侧
            x:0, // 触发元素的坐标
            y:0, // 触发元素的坐标
            height:0, // 触发元素的高
            width:0, // 触发元素的宽
            vwHeight:0, // 整体向上偏移的数量
            message:{} // 触发的消息
        }
    },
    computed:{
        styles(){
            if(this.self) {
                return {
                    top: computedSub(this.y, this.vwHeight) + 'px',
                    right: computedSub(computedSub(window.innerWidth, this.x), this.width) + 'px'
                }
            }else{
                return {
                    top: computedSub(this.y, this.vwHeight) + 'px',
                    left: this.x + 'px'
                }
            }
        }
    },
    mounted(){
        this.vwHeight = computedDiv(computedMul(window.innerWidth, 130), 750)
    },
    methods:{
        open(option){
            this.list = []
            if(option.copy)this.list.push({name:t('复制'),value:'copy',icon:'description-o'})
            if(option.delete)this.list.push({name:t('删除'),value:'delete',icon:'delete-o'})
            if(option.revoke)this.list.push({name:t('撤回'),value:'revoke',icon:'revoke'})
            this.self = option.self
            this.x = option.x
            this.y = option.y
            this.height = option.height
            this.width = option.width
            this.message = option.message
            this.$nextTick(()=>{
                this.show = true
            })
        },
        close(){
            this.$nextTick(()=>{
                this.show = false
            })
        },
        tabClick(value){
            if(value==='copy')this.copyMessage()
            else if(value==='delete')this.delMessage()
            else if(value==='revoke')this.revokeMessage()
        },
        // 复制消息
        copyMessage(){
            let content = ''
            if(this.message.msg_type==1){
                // 复制文案
                content = initRichText(this.message.content)
                content = content.replace(/<img[^>]*>|<\/?p>/g, '')
            }else if(this.message.msg_type==2){
                // 复制文件链接
                content = this.message.file.file_url
            }
            if(content){
                const success = copy(content);
                if (success) {
                    this.success(t('复制成功'));
                } else {
                    this.fail(t('复制失败'));
                }
            }else{
                this.fail(t('复制失败'));
            }
        },
        // 删除消息
        delMessage(){
            this.$chatApi.post('/api/chat/talk_messages/delete',{
                talk_type: this.talkType,
                receiver_id: this.toId,
                records:[
                    {id: this.message.id}
                ]
            }).then(()=>{
                this.success(t('删除成功'))
                this.$emit('deleteMeaasge', this.message.id)
            }).catch(() => { })
        },
        // 撤回消息
        revokeMessage(){
            this.$chatApi.post('/api/chat/talk_messages/revoke',{
                record:{id: this.message.id}
            }).then(()=>{
                this.$emit('revokeMeaasge', this.message.id)
            }).catch(() => { })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.chatSheet{
    height: 100px;
    background-color: $chat-card-bg;
    position: fixed;
    z-index: 5;
    border-radius: 10px;
}
.showSelfSheet{
    transform-origin: right bottom;
    transform: scale(1);
    transition: transform 0.3s;
}
.showSheet{
    transform-origin: left bottom;
    transform: scale(1);
    transition: transform 0.3s;
}
.hideSelfSheet{
    transform-origin: right bottom;
    transform: scale(0);
}
.hideSheet{
    transform-origin: left bottom;
    transform: scale(0);
}
.chatSheetRect{
    width: 25px;
    height: 25px;
    background-color: $chat-card-bg;
    transform: rotate(45deg);
    position: absolute;
    bottom: -10px;
}
.selftRect{
    right: 30px;
}
.rect{
    left: 30px;
}
</style>