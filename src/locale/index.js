import { getLang } from '@/chat/config'
import en from '@/chat/locale/en.json'
import zh from '@/chat/locale/zh.json'
import hk from '@/chat/locale/hk.json'
import ja from '@/chat/locale/ja.json'
import ko from '@/chat/locale/ko.json'
import th from '@/chat/locale/th.json'
import vi from '@/chat/locale/vi.json'
import it from '@/chat/locale/it.json'
import id from '@/chat/locale/id.json'
import es from '@/chat/locale/es.json'
import tr from '@/chat/locale/tr.json'
import ms from '@/chat/locale/ms.json'

export const messages = {
    en,
    zh,
    hk,
    ja,
    ko,
    th,
    vi,
    it,
    id,
    es,
    tr,
    ms
}

/**
 * 第一个为默认语言
 * name => 前端使用的多语言名称
 * value => 后端使用的多语言名称
 */
const langs = [
    {name:'en',value:'en'},// 英语
    {name:'zh',value:'zh-Hans'},// 简体中文
    {name:'hk',value:'zh-Hant'},// 繁体中文
    {name:'ja',value:'ja'},// 日语
    {name:'ko',value:'ko'},// 韩语
    {name:'th',value:'th'},// 泰语
    {name:'vi',value:'vi'},// 越南语
    {name:'it',value:'it'},// 意大利语
    {name:'id',value:'id'},// 印度尼西亚语
    {name:'es',value:'es'},// 西班牙语
    {name:'tr',value:'tr'},// 土耳其语
    {name:'ms',value:'ms'} // 马来西亚语
]
// 获取当前本地语言对应的后端使用的语言名称
export function getHeaderLang(){
    let lang = getLang()
    const langInfo = langs.find(item=>item.name==lang)
    if(langInfo===undefined)return langs[1].value
    else return langInfo.value
}