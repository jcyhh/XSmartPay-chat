<template>
    <div>
        <chat-nav title="发红包"></chat-nav>

        <div class="pl30 pr30 mt30">

            <div class="flex jb ac">
                <el-dropdown trigger="click" @command="giftChange">
                    <div class="flex ac chatColor size0">
                        <div class="size28 mr10">{{ giftTypes[giftCur].name }}</div>
                        <i class="el-icon-arrow-down size24"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item.value" v-for="(item,index) in giftTypes" :key="index">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown trigger="click" @command="ccyChange">
                    <div class="flex ac chatColor size0">
                        <div class="size28 mr10">{{ ccyTypes[ccyCur].name }}</div>
                        <i class="el-icon-arrow-down size24"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item.value" v-for="(item,index) in ccyTypes" :key="index">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <div class="chatCard mt20 flex jb ac" @click="jump('/giftChoose')" v-if="giftCur==2">
                <div class="size34">发给谁</div>
                <i class="el-icon-arrow-right size34 chatGray"></i>
            </div>
            <div class="chatCard mt20 flex jb ac" v-else>
                <div class="flex ac">
                    <img src="@/assets/chat/12.png" class="icon12 mr10">
                    <div class="size34">红包个数</div>
                </div>
                <input type="text" placeholder="请填写红包个数" class="size30 flex1 tr">
            </div>


            <div class="size24 chatGray mt20">本群共10人</div>

            <div class="chatCard mt40 flex jb ac">
                <div class="size34">总金额 ({{ ccyTypes[ccyCur].name }})</div>
                <input type="text" placeholder="请填写红包金额" class="size30 flex1 tr">
            </div>

            <div class="chatCard mt40 flex jb ac">
                <div class="size34">备注</div>
                <input type="text" placeholder="恭喜发财，大吉大利" class="size30 flex1 tr">
            </div>

            <div class="tc bold size0 mt80">
                <span class="size70">0.00</span>
                <span class="size50 ml10">{{ ccyTypes[ccyCur].name }}</span>
            </div>

            <div class="flex jc ac mt40">
                <div class="sendBtn flex jc ac chatLinear" v-scale>发送</div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            giftTypes: [
                { name: '拼手气红包', value: 1 },
                { name: '普通红包', value: 2 },
                { name: '专属红包', value: 3 }
            ],
            giftCur: 0,

            ccyTypes: [
                { name: 'USDT', value: 1 },
                { name: 'Biz', value: 2 }
            ],
            ccyCur: 0

        }
    },
    methods:{
        giftChange(value){
            this.giftCur = this.giftTypes.findIndex(e=>e.value==value)
        },
        ccyChange(value){
            this.ccyCur = this.ccyTypes.findIndex(e=>e.value==value)
        }
    }
}
</script>

<style lang="scss" scoped>
@use "@/chat/styles/index.scss" as *;
.icon12{
    width: .32rem;
    height: .37rem;
}
.sendBtn{
    width: 4rem;
    height: .88rem;
    border-radius: .2rem;
    font-size: .3rem;
}
</style>