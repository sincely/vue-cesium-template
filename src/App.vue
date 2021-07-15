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

<style>
* {
  padding: 0;
  margin: 0;
}
</style>
