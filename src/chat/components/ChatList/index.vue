<template>
    <div>
        <van-pull-refresh :style="{ minHeight }" v-model="refreshing" @refresh="onRefresh">
            <van-list :style="{ minHeight }" v-model="loading" :finished="finished" :finished-text="paging ? $t('没有更多了'): ''"
                @load="onLoad" :immediate-check="true" :loading-text="$t('加载中...')">
                <slot :list="list"></slot>
                <chat-empty v-if="list.length == 0"></chat-empty>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
/**
 * @name CusList
 * @description 分页组件
 * @param {Boolean} paging - 是否需要分页
 * @param {String} api - 接口
 * @param {String} listKey - 响应体里列表字段的KEY，默认“list”
 * @param {Object} param - 请求时额外传入的参数
 * @param {Number} limit - 分页条数
 * @param {Object} minHeight - 最小高度，用于设置下拉刷新的触发区域
 * @param {Function} getListData - 列表返回的所有数据
 */
export default {
    name: "CusList",
    props: {
        paging: {
            type: Boolean,
            default: true
        },
        api: {
            type: String,
            default: ''
        },
        listKey: {
            type: String,
            default: 'list'
        },
        param: {
            type: Object,
            default() {
                return {}
            }
        },
        limit: {
            type: Number,
            default: 10
        },
        minHeight: {
            type: String,
            default: '100vh'
        },
        check:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            list: [],
            page: 0,
            loading: false,
            finished: false,
            refreshing: false,
        }
    },
    // watch: {
    //     param: {
    //         handler: function (val) {
    //             this.refresh()
    //         },
    //         deep: true
    //     }
    // },
    methods: {
        onLoad() {
            if (this.refreshing) {
                this.list = []
                this.refreshing = false
                this.page = 0
            }
            this.page++
            let params = {}
            if (this.paging) {
                params = {
                    page_no: this.page,
                    page_size: this.limit,
                    ...this.param
                }
            }
            this.$chatApi.get(this.api, params).then(res => {
                const list = res[this.listKey]
                if (this.paging) {
                    this.list = this.list.concat(list)
                    this.loading = false
                    this.finished = list.length < this.limit
                } else {
                    this.list = list
                    this.loading = false
                    this.finished = true
                }
                this.$emit('getListData', res)
            }).catch(() => { })
        },
        onRefresh() {
            this.finished = false
            this.loading = true
            this.onLoad()
        },
        refresh() {
            this.refreshing = true
            this.finished = false
            this.loading = true
            this.onLoad()
        }
    }
}
</script>

<style lang="scss"></style>