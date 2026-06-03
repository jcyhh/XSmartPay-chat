<template>
    <div>
        <chat-nav :title="$t('新的朋友')"></chat-nav>

        <div class="pl30 pr30 mt30">

            <!-- 状态 1待审核 2已通过 3已拒绝 4已超时 -->
            <chat-list ref="list" api="/api/chat/friend_applies" listKey="friend_applies" v-slot="{list}">
                <div class="card">
                    <div class="flex ac" v-for="(item,index) in list" :key="index">
                        <img :src="item.user.avatar" class="avatar mr30">
                        <div class="cardRight flex1 flex jb ac" :class="index==list.length-1?'noBorder':''">
                            <div>
                                <div class="size30 mb5">{{ item.user.nickname }}</div>
                                <div class="size24 chatGray br">{{ item.content }}</div>
                            </div>
                            <!-- 自己发起的申请 -->
                            <div v-if="item.status==1">
                                <div class="cancel btn chatGray flex jc ac" v-if="item.is_my">{{ $t('待同意') }}</div>
                                <div class="flex ac" v-else>
                                    <div class="cancel btn flex jc ac" v-scale @click="delayFun(repulse, item.id)">{{ $t('拒绝') }}</div>
                                    <div class="confrim btn flex jc ac ml10" v-scale @click="delayFun(replace,`/friendAgree/${item.id}`)">{{ $t('添加') }}</div>
                                </div>
                            </div>
                            <!-- 他人发起的申请 -->
                            <div class="cancel btn flex jc ac" v-if="item.status==2">{{ $t('已通过') }}</div>
                            <div class="cancel btn chatGray flex jc ac" v-if="item.status==3">{{ $t('已拒绝') }}</div>
                            <div class="cancel btn chatGray flex jc ac" v-if="item.status==4">{{ $t('已超时') }}</div>
                        </div>
                    </div>
                </div>

            </chat-list>

        </div>

    </div>
</template>

<script>
import { t } from '@/main'

export default {
    methods:{
        
    },
    methods:{
        repulse(id){
            this.$chatApi.post(`/api/chat/friend_applies/${id}/reject`).then(res=>{
                this.toast(t('已拒绝'))
                this.$nextTick(()=>{
                    this.$refs.list.refresh()
                })
            }).catch(() => { })
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.card{
    padding: 0 30px;
    border-radius: 20px;
    background-color: $chat-card-bg;
    .avatar{
        width: 76px;
        height: 76px;
        border-radius: 50%;
    }
    .cardRight{
        padding: 20px 0;
        border-bottom: 1PX solid $chat-card-line;
        min-height: 116px;
        .btn{
            min-width: 120px;
            height: 52px;
            border-radius: 26px;
            padding: 0 26px;
            font-size: 24px;
        }
        .cancel{
            background-color: $chat-card-box-bg;
        }
        .confrim{
            background-color: rgba($color: $chat-color, $alpha: 0.2);
            color: $chat-color;
        }
    }
}
</style>