/**
 * 全局混入
 */
import { Toast } from 'vant';
export default {
    data() {
		return {
			delayTimer: null,
			delaySecond: 300 // 防抖的延迟时间，毫秒
		}
	},
    beforeDestroy(){
        // 清除定时器
        if(this.delayTimer){
            clearTimeout(this.delayTimer)
            this.delayTimer = null
        }
    },
    methods:{
        /**
		 * 用在发POST的按钮上，或者有短暂点击动画的按钮上
		 * @param {Function} methods - 要执行的方法
		 * @param {*} info - 方法需要的参数
		 * @example 仅支持传入一个参数，多个参数可传入Object
		 * @click="debounce(submit)"
		 * @click="debounce(submit, id)"
		 * @click="debounce(submit, {id:1,type:2})"
		 */
		delayFun(methods, info){
            // 先清除定时器
			if(this.delayTimer){
				clearTimeout(this.delayTimer)
				this.delayTimer = null
			}
            // 延迟调用
			this.delayTimer = setTimeout(()=> {
				if((info && info !== '') || info ==0)methods(info);
				else methods();
			}, this.delaySecond)
		},
		jump(path){
			this.$router.push(path)
		},
		back(count = -1){
			this.$router.go(count)
		},
		replace(path){
			this.$router.replace(path)
		},
		toast(message){
			Toast(message);
		},
        success(message){
            Toast.success(message);
        },
        fail(message){
            Toast.fail(message);
        }
    }
}