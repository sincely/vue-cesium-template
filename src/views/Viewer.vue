<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
// @ is an alias to /src
import Cesium from '@/components/CesiumExample/Cesium.vue'

export default {
  name: 'Cesium',
  components: {
    Cesium,
  },
  mounted() {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')

    // eslint-disable-next-line no-undef
    var viewer = new Cesium.Viewer('cesiumContainer')

    // eslint-disable-next-line no-console
    console.log(viewer)
  },
}
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
