# 聊天

> vue2项目
>
> 打包后，目标项目通过内嵌网页集成

## 打包前的修改

### 网页标题

> **config/index.js**的**appName**为项目名称，修改后将作用于网站标题

### 网页图标

> **public/favico.ico**

### 网页主题

#### css变量

> **chat/styles/color.scss**

#### UI库颜色js变量

> **chat/config/index.js** 通过传参覆盖组件默认颜色

1. **mainColor** 主色
2. **boxColor** 部分组件未激活或者未选中时的颜色

### 网页传参

> **public/index.html**在此接收目前项目传来的参数，**驼峰**命名

```javascript
// 参数拼接，项目为 hash 模式，必须以 /#/ 开头
/#/?userId=xx&&lang=zh&&address=xx&&token=xx
```

1. **token**：请求头token

2. **address**：请求头钱包地址，不传代表请求头不用传钱包地址

3. **userId**：用户id，聊天逻辑里用作区分自己和他人

4. **lang**：多语言，不传按英文，如果项目没多语言传中文即可

   > 语言参数对不上也可前往 **src/locale/index.js** 中修改对应属性值

   * **en** —— 英文
   * **zh** —— 简体中文 —— 请求头传递的是 **zh-Hans**
   * **hk** —— 繁体中文 —— 请求头传递的是 **zh-Hant**
   * **ja** —— 日语
   * **ko** —— 韩语
   * **th** —— 泰语
   * **vi** —— 越南语
   * **it** —— 意大利语
   * **id** —— 印度尼西亚语
   * **es** —— 西班牙语
   * **tr** —— 土耳其语
   * **ms** —— 马来西亚语

### 网页内嵌

> 准备一个空白页面，用来内嵌网页

```vue
<!-- 以H5项目举例，使用iframe标签内嵌网页 -->
<iframe :src="" class="chat" @load=""></iframe>
<!-- src 完整网页链接（携带了参数） -->
<!-- 页面开始使用加载Loading转圈，@load监听里关闭loading，避免长时间空白页面体验差 -->

.chat{
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    border: none;
}
```

```javascript
// 当收到内嵌网页推送的message事件时
onMessage(e){
  	if(e.data?.type === "back"){
        // 目前只有初始主页（会话列表）有一个返回箭头的点击事件推送
      	// 用于退出当前内嵌了页面的子页面
    }
}

// 页面生命周期里监听内嵌网页推送的message事件
window.addEventListener("message", onMessage)
// 页面销毁生命周期注销监听
window.removeEventListener("message", onMessage)
```

## env

> .env.development 开发环境
>
> .env.production 正式环境

### VUE_APP_BASE_URL

> api接口地址
>
> 开发环境配置完整地址
>
> 正式环境配置空字符串，代码缺省为**window.origin**（https://www.xxx.com）

### VUE_APP_SOCKET_URL

> socket域名
>
> 开发环境配置域名即可，使用**ws**协议
>
> 正式环境配置空字符串，使用**wss**协议，代码缺省为**location.hostname**（www.xxx.com）
>
> 正式环境如需使用wss协议，修改**chat/config/index.js** 的 **socketUrl** 的拼接逻辑

## 依赖

* VantUI  2.X [https://vant-ui.github.io/vant/v2/#/zh-CN/](https://vant-ui.github.io/vant/v2/#/zh-CN/)
