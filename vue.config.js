const webpack = require("webpack");
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
      config.resolve.alias
      .set('@$', resolve('src'))
      .set('views',resolve('src/views'))
  },
  publicPath:process.env.NODE_ENV === 'production'
  ? './'
  : '/',
  // pages:{
  //   index: {
  //     entry: 'src/main.js',
  //     title: '录像时间轴播放器',//放要改的title名
  //   },
  // },
  devServer: {
    disableHostCheck: true,
    port:8089,
    host:'0.0.0.0'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
      // 这里假设你有 `src/variables.scss  src/scss/mixin.scss` 这两个文件
        path.resolve(__dirname,"./src/scss/variables.scss"),
        path.resolve(__dirname,"./src/scss/mixin.scss")
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/assets/style/variable.scss";
        `
      },
    }
  }
};