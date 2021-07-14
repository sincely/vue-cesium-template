<template>
  <div id="app">
    <viewer id="cesiumContainer"></viewer>
  </div>
</template>

<script>
import Viewer from './views/Viewer.vue'
export default {
  name: 'App',
  components: {
    Viewer,
  },
}
</script>

<style lang="less">
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
