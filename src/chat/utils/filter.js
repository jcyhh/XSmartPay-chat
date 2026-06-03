import { t } from '@/main';
import Vue from 'vue'

/**
 * @description 格式化数字
 * @returns 1000000 => 1,000,000
 */
Vue.filter('initNumber', function(str) {
    if (str) {
        let num = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 6
        }).format(str)
        return num==0?'0.00':num
    } else {
        return '0.00'
    }
});

// 格式化日期字符串
Vue.filter('initTime', function (timestamp) {
    if(!timestamp)return '--'
	const date = new Date(timestamp); // 将时间戳转换为 Date 对象
	const now = new Date(); // 当前时间

	// 获取日期信息
	const isToday = date.toDateString() === now.toDateString();
	const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	if (isToday) {
		return `${hours}:${minutes}`;
	} else if (isYesterday) {
		return `${t('昨天')} ${hours}:${minutes}`;
	} else {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始
		const day = date.getDate().toString().padStart(2, '0');

		// 判断是否在当前年份内
		if (year === now.getFullYear()) {
			return `${month}-${day} ${hours}:${minutes}`;
		} else {
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		}
	}
});