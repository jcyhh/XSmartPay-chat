module.exports = {
    plugins: {
      'postcss-px-to-viewport': {
        unitToConvert: 'px',      // 需要转换的单位，默认为"px"
        viewportWidth: 750,       // 设计稿的视口宽度(750表示750px设计稿)
        unitPrecision: 5,         // 单位转换后保留的小数位数
        propList: ['*'],         // 能转化为vw的属性列表，*表示全部
        viewportUnit: 'vw',       // 希望使用的视口单位
        fontViewportUnit: 'vw',   // 字体使用的视口单位
        selectorBlackList: [],    // 需要忽略的CSS选择器
        minPixelValue: 1,         // 最小的转换数值(小于1px不转换)
        mediaQuery: false,        // 是否在媒体查询中也转换px
        replace: true,            // 是否直接替换属性值而不添加备用
        exclude: [/node_modules/],// 忽略node_modules目录下的文件
        landscape: false,         // 是否添加横屏媒体查询条件
        landscapeUnit: 'vw',      // 横屏单位
        landscapeWidth: 1334      // 横屏宽度
      },
      // 自动添加浏览器前缀
      'autoprefixer': {
        overrideBrowserslist: [
          'Android 4.1',
          'iOS 7.1',
          'Chrome > 31',
          'ff > 31',
          'ie >= 8'
        ]
      }
    }
  }