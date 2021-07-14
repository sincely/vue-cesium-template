<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      mapUrl: `${this.$mapUrl}/map/`, // 地图资源
      baseUrl: this.$baseUrl,
      viewer: null,
      websocketUrl: this.$websocketUrl, // websocketUrl
    }
  },
  mounted() {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')
    var viewer = new Cesium.Viewer('cesiumContainer', {
      geocoder: false, //一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
      homeButton: true, //首页位置，点击之后将视图跳转到默认视角。
      sceneModePicker: true, //切换2D、3D 和 Columbus View (CV) 模式。
      baseLayerPicker: false, //选择三维数字地球的底图（imagery and terrain）。
      navigationHelpButton: true, //帮助提示，如何操作数字地球。
      animation: false, //控制视窗动画的播放速度。
      creditsDisplay: false, //展示商标版权和数据源。
      timeline: false, //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
      fullscreenButton: true, //视察全屏按钮
    })
    viewer.scene.globe.enableLighting = true //启用以太阳为光源的地球
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
