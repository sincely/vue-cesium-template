'use strict'
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin') //打包配置自动忽略console.log等
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
    proxy: {
      '^/sso': {
        target: 'http://baidu.com', // 重写路径
        ws: true, //开启WebSocket
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true,
      },
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
    //关闭 webpack 的性能提示
    performance: {
      hints: false,
    },
    output: {
      sourcePrefix: ' ',
    },
    amd: {
      toUrlUndefined: true,
    },
    // 插件配置
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
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // 忽略/moment/locale下的所有文件
      // 打包分析
      new BundleAnalyzerPlugin({
        //  可以是`server`，`static`或`disabled`。
        //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        analyzerMode: 'server',
        //  将在“服务器”模式下使用的主机启动HTTP服务器。
        analyzerHost: '127.0.0.1',
        //  将在“服务器”模式下使用的端口启动HTTP服务器。
        analyzerPort: 8888,
        //  路径捆绑，将在`static`模式下生成的报告文件。
        //  相对于捆绑输出目录。
        reportFilename: 'report.html',
        //  模块大小默认显示在报告中。
        //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //  有关更多信息，请参见“定义”一节。
        defaultSizes: 'parsed',
        //  在默认浏览器中自动打开报告
        openAnalyzer: true,
        //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        generateStatsFile: false,
        //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //  相对于捆绑输出目录。
        statsFilename: 'stats.json',
        //  stats.toJson（）方法的选项。
        //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        logLevel: 'info', //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
      }),
      // gzip
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        // test: /\.js$|\.html$|\.json$|\.css/,
        test: /\.js$|\.json$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: true // 删除原文件
      }),
      //在new TerserPlugin增加多进程打包速度快点
      new TerserPlugin({
        cache: true, // 降低版本号后增加
        sourceMap: false, //降低版本号后增加
        // 多进程
        parallel: true, // 降低版本号后增加
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'], // 移除console
          },
        },
      }),
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false,
    },
    // 在resolve中设置cesium别名，
    // 这样在引入的时候就可以根据别名找到Cesium的包
    resolve: {
      extensions: ['.js', '.vue', '.json'], //自动解析确定的拓展名,使导入模块时不带拓展名
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
