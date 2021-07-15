'use strict'
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = 'vue cesium project'
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  /*  node_modules里的依赖默认是不会编译的, 会导致es6语法在ie中的语法报错,
  所以需要在vue.config.js中使用transpileDependencies属性配置node_modules中指定哪些文件夹或文件需要编译. */
  transpileDependencies: [
    '@jiaminghi/data-view',
    // '@znemz/cesium-navigation',
    'ant-design-vue',
    'axios',
    'element-ui',
    'uuid',
    'vue-context',
    'vue-dialog-drag',
    'cesium',
    // 'cesium-navigation-es6',
  ],
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    output: {
      sourcePrefix: ' ',
    },
    amd: {
      toUrlUndefined: true,
    },

    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      //定义Cesium从哪里加载资源，如果使用默认的''，
      //却变成了绝对路径了，所以这里使用'./',使用相对路径
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./'),
      }),
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false,
    },
    // 在resolve中设置cesium别名，
    // 这样在引入的时候就可以根据别名找到Cesium的包
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        cesium: path.resolve(__dirname, cesiumSource),
      },
    },
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
  },
}
