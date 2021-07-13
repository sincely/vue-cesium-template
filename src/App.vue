<template>
  <div id="app">
    <viewer></viewer>
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
/* .rengu-logo-container {
  position: absolute;
  bottom: 4px;
  left: 10px;
  width: 40px;
  height: 40px;
}
.rengu-logo-container img {
  width: 40px;
  height: 40px;
} */
</style>
