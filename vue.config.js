const { defineConfig } = require('@vue/cli-service')

const appConfig = require('./src/config/index')

module.exports = defineConfig({
    transpileDependencies: true,
    // 关闭eslint
    lintOnSave: false,
    publicPath: './',
    outputDir: 'dist',
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            // 网站标题
            args[0].title = appConfig.appName
            return args;
        });
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@use "@/chat/styles/color.scss" as *;`
            },
            postcss: {
                postcssOptions: {
                    config: true
                }
            }
        }
    }
})
