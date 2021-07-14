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
      // baseUrl: this.$baseUrl,
      viewer: null,
      // websocketUrl: this.$websocketUrl, // websocketUrl
    }
  },
  mounted() {
    console.log(this.mapUrl)
    console.log(Cesium)
    var viewer = new Cesium.Viewer('cesiumContainer', {
      geocoder: true, //一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
      homeButton: true, //首页位置，点击之后将视图跳转到默认视角。
      sceneModePicker: true, //切换2D、3D 和 Columbus View (CV) 模式。
      baseLayerPicker: true, //选择三维数字地球的底图（imagery and terrain）。
      navigationHelpButton: true, //帮助提示，如何操作数字地球。
      animation: true, //控制视窗动画的播放速度。
      creditsDisplay: false, //展示商标版权和数据源。
      timeline: true, //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
      fullscreenButton: true, //视察全屏按钮
      //图像图层提供者，仅baseLayerPicker设为false有意义
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        credit: '',
        url: this.mapUrl,
      }), //图像图层提供者，仅baseLayerPicker设为false有意义
    })
    viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权

    // 将三维球定位到中国
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
        heading: Cesium.Math.toRadians(348.4202942851978),
        pitch: Cesium.Math.toRadians(-89.74026687972041),
        roll: Cesium.Math.toRadians(0),
      },
      complete: function callback() {
        // 定位完成之后的回调函数
      },
    })
  },
}
</script>
<style lang="less">
.map-box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
