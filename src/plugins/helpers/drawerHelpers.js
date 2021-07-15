const Cesium = require('cesium/Cesium')

// 获取点
export function getPointFromWindowPoint(point, viewer) {
  if (viewer.scene.terrainProvider.constructor.name == 'EllipsoidTerrainProvider') {
    return viewer.camera.pickEllipsoid(point, viewer.scene.globe.ellipsoid)
  } else {
    let ray = viewer.scene.camera.getPickRay(point)
    return viewer.scene.globe.pick(ray, viewer.scene)
  }
}

//笛卡尔坐标系转WGS84坐标系
export function Cartesian3_to_WGS84(point) {
  let cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
  let lat = Cesium.Math.toDegrees(cartographic.latitude)
  let lng = Cesium.Math.toDegrees(cartographic.longitude)
  let alt = cartographic.height
  return { lat: lat, lng: lng, alt: alt }
}

//WGS84坐标系转笛卡尔坐标系
export function WGS84_to_Cartesian3(point) {
  let car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt)
  let x = car33.x
  let y = car33.y
  let z = car33.z
  return { x: x, y: y, z: z }
}

//计算两点间距离
export function getFlatternDistance(lat1, lng1, lat2, lng2) {
  let EARTH_RADIUS = 6378137.0 //单位M
  let PI = Math.PI

  function getRad(d) {
    return (d * PI) / 180.0
  }
  let f = getRad((lat1 + lat2) / 2)
  let g = getRad((lat1 - lat2) / 2)
  let l = getRad((lng1 - lng2) / 2)

  let sg = Math.sin(g)
  let sl = Math.sin(l)
  let sf = Math.sin(f)

  let s, c, w, r, d, h1, h2
  let a = EARTH_RADIUS
  let fl = 1 / 298.257

  sg = sg * sg
  sl = sl * sl
  sf = sf * sf

  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl

  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}
