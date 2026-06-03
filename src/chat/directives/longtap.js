/*
 * @Description: 
 * @Version: 1.0
 * @Author: JCY
 * @Date: 2025-04-28 13:47:23
 */
// 长按指令
export default {
    bind: function (el, binding) {
        if (typeof binding.value !== 'function') {
            console.warn('v-longpress 指令需要接收一个函数作为参数');
            return;
        }

        let pressTimer = null;
        const pressThreshold = binding.arg || 500; // 默认500ms

        const start = (e) => {
            if (e.type === 'click' && e.button !== 0) return;

            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }

            pressTimer = setTimeout(() => {
                binding.value(el.getBoundingClientRect()); // 传递包含坐标的事件对象
                pressTimer = null;
            }, pressThreshold);
        };

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };

        // 添加事件监听
        el.addEventListener('mousedown', start);
        el.addEventListener('touchstart', start);
        el.addEventListener('mouseup', cancel);
        el.addEventListener('mouseleave', cancel);
        el.addEventListener('touchend', cancel);
        el.addEventListener('touchcancel', cancel);
    },

    unbind: function (el) {
        // 清理所有事件监听器
        const events = ['mousedown', 'touchstart', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'];
        events.forEach(event => {
            el.removeEventListener(event, el[`_longpress_${event}`]);
        });
    }
};