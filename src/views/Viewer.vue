<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
import CesiumNavigation from '@/plugins/cesium-navigation-es6' // 指南针插件
import * as Cesium from 'cesium/Cesium'
import * as widgets from 'cesium/Widgets/widgets.css'

let viewer
export default {
  name: '',
  data() {
    return {
      mapUrl: `${this.$mapUrl}/map/`, // 地图资源
      baseUrl: this.$baseUrl, // 后台地址
      // viewer: null,
      websocketUrl: this.$websocketUrl, // websocketUrl
    }
  },
  methods: {
    // 初始化
    init() {
      viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: true, // 一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
        homeButton: true, // 首页位置，点击之后将视图跳转到默认视角。
        sceneModePicker: false, // 切换2D、3D 和 Columbus View (CV) 模式。
        baseLayerPicker: false, // s是否显示底图切换控件，默认 true
        navigationHelpButton: true, // 帮助提示，如何操作数字地球。
        animation: false, // 是否显示动画效果控件，默认 true ；设置 false，动画效果控件不可见。
        creditsDisplay: false, // 展示商标版权和数据源。
        timeline: true, // 是否显示时间轴控件，默认true；设置 false，时间轴控件不可见
        fullscreenButton: true, // 视察全屏按钮
        // 图像图层提供者，仅baseLayerPicker设为false有意义
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
          credit: '',
          url: this.mapUrl,
        }),
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权
      // 使用太阳作为光源，可以照亮地球。
      viewer.scene.globe.enableLighting = false
      // 关闭地面大气效果，（默认为开启状态）
      viewer.scene.globe.showGroundAtmosphere = false
      // FPS 帧率显示
      viewer.scene.debugShowFramesPerSecond = true
      // cesiumCanvas id 设置
      viewer.scene.canvas.id = 'cesiumCanvas'
      this.flytochina()
      // 指北针插件
      this.initNavigation()
      // 初始地图高清
      // this.changeBaseMap('tdtsl')
    },
    /**
     *  将三维球定位到中国
     *
     * */
    flytochina() {
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
    /**
     * 切换地图
     */
    changeBaseMap(type) {
      viewer.imageryLayers.removeAll()
      switch (type) {
        //天地图
        case 'tdt':
          viewer.imageryLayers.addImageryProvider(
            new WebMapTileServiceImageryProvider({
              url: 'https://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=93d1fdef41f93d2211deed6d22780c48',
              layer: 'tdtBasicLayer',
              style: 'default',
              format: 'image/jpeg',
              tileMatrixSetID: 'GoogleMapsCompatible',
              show: false,
              maximumLevel: 16,
            })
          )
          break
        //天地图矢量
        case 'tdtsl':
          viewer.imageryLayers.addImageryProvider(
            new WebMapTileServiceImageryProvider({
              url: 'https://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=93d1fdef41f93d2211deed6d22780c48',
              layer: 'tdtVecBasicLayer',
              style: 'default',
              format: 'image/jpeg',
              tileMatrixSetID: 'GoogleMapsCompatible',
              show: false,
            })
          )
          break
        //谷歌影像
        case 'gg':
          var url = 'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
          viewer.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({ url: url }))
          break
        case 'arcgis':
          viewer.imageryLayers.addImageryProvider(
            new ArcGisMapServerImageryProvider({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
              enablePickFeatures: false,
            })
          )
          break
        //必应
        case 'bing':
          viewer.imageryLayers.addImageryProvider(
            new BingMapsImageryProvider({
              url: 'https://dev.virtualearth.net',
              key: 'get-yours-at-https://www.bingmapsportal.com/',
              mapStyle: BingMapsStyle.AERIAL,
            })
          )
          break
        case 'dark':
          viewer.imageryLayers.addImageryProvider(
            new createTileMapServiceImageryProvider({
              url: 'https://cesiumjs.org/blackmarble',
              credit: 'Black Marble imagery courtesy NASA Earth Observatory',
              flipXY: true, // Only old gdal2tile.py generated tilesets need this flag.
            })
          )
          break
      }

      //全球影像中文注记服务
      viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url: 'https://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=93d1fdef41f93d2211deed6d22780c48',
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false,
        })
      )
      //全球矢量中文标注服务
      viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url: 'https://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=93d1fdef41f93d2211deed6d22780c48',
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
        })
      )
    },

    initNavigation() {
      let options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      CesiumNavigation(viewer, options)
    },
  },

  mounted() {
    console.log(Cesium)
    this.init()
  },
}
</script>
<style scoped>
.map-box {
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
