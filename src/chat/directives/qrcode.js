import { computedDiv, computedMul } from '@/chat/utils'
import qrcode from 'qrcode'

export default {
    bind(el, binding) {
        el.style.backgroundColor = '#FFFFFF'
        const args = binding.arg.split('_')
        const width = Math.floor(computedDiv(computedMul(args[0], window.innerWidth), 750))
        el.style.borderRadius = Math.floor(computedDiv(computedMul(args[1], window.innerWidth), 750)) + 'px'
        el.style.width = width + 'px'
        el.style.height = width + 'px'
        if(binding.value){
            qrcode.toCanvas(el, binding.value, {
                width,
                margin: 2
            })
        }
    },
    componentUpdated(el, binding){
        if(binding.value){
            const args = binding.arg.split('_')
            const width = Math.floor(computedDiv(computedMul(args[0], window.innerWidth), 750))
            qrcode.toCanvas(el, binding.value, {
                width,
                margin: 2
            })
        }
    }
}