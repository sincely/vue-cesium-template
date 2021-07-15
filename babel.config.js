module.exports = {
  // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
  presets: ['@vue/cli-plugin-babel/preset'],
  env: {
    //  当编译项目时，需要花费很长时间，会在67%左右卡顿 内容过多，编译速度极慢
    development: {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      plugins: ['dynamic-import-node'],
    },
  },
  plugins: [],
}
