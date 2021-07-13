const Cesium = require('cesium/Cesium')
/**
 * @function 格式化位置信息
 * @export formatPositionTool
 * @param {string} longitude
 * @param {string} latitude
 * @param {string} height
 * @param {string} angle
 * @param {string} roll
 * @param {string} pitch
 * @param {string} modelType
 * @return {*}
 */
export function formatPositionTool(longitude, latitude, height, angle, roll, pitch, modelType) {
  let _pitch = pitch ? pitch : 0
  let _roll = roll ? roll : 0
  let _angle = angle ? angle : 0

  console.log(modelType)
  if (modelType === 117003) {
    _angle += 180
  } else if (modelType === 117002) {
    _angle -= 90
  }
  let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
  let heading = Cesium.Math.toRadians(_angle)
  _roll = Cesium.Math.toRadians(_roll)
  let hpr = new Cesium.HeadingPitchRoll(heading, _pitch, _roll)
  let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
  let positionInfo = {
    position: position,
    orientation: orientation,
    hpr: hpr,
  }
  return positionInfo
}

/**
 * @function 位置信息转经、纬、高信息
 * @export convertPosToLLH
 * @param {*} pos
 * @return {}
 */
export function convertPosToLLH(pos) {
  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos)
  let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
  let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)
  let posInfo = {
    longitude: longitude,
    latitude: latitude,
    height: cartographic.height.toFixed(2),
  }
  return posInfo
}

/**
 *
 * @function 位置信息转经、纬、高信息
 * @export getModelColorByCamp
 * @param {string} camp
 */
export function getModelColorByCamp(camp) {
  switch (camp) {
    case 'red':
      return 'Red'
    case 'blue':
      return 'Blue'
    case 'friend':
      return 'Green'
    case 'middle':
      return 'Yellow'
    case 'unknown':
      return 'Gray'
    default:
      return 'White'
  }
}

// 获取3D模型url
/*export function getThreeDModelByType(type) {
  switch (type) {
    case 111008: // 舰艇 // 护卫舰
      return require('../models/Quzhujian/quzhujian.glb')
    case 111006: // 船  // 哨舰
      return require('../models/Quzhujian/quzhujian.glb')
    case 111009: // 驱逐舰
      return require('../models/Quzhujian/quzhujian.glb')
    case 111007: // 航母
      return require('../models/Carrier1/carrier.glb')
    case 112001: // 潜艇
      return require('../models/Submarine/submarine.glb')
    case 112002: // 鱼雷
      return require('../models/YL/YL.glb')
    case 114001: // 战斗机
      return require('../models/Fighter/fighter.glb')
    case 114002: // 导弹
      return require('../models/Missile/missile.glb')
    case 113001: // 直18F
      return require('../models/Copter/copter.glb')
    case 116001: // 坦克
      return require('../models/Tank/tank.glb')
    case 116040: // 雷达
      return require('../models/Radar/radar.glb')
    case 117001: // 车
      return require('../models/GroundVehicle/car.glb')
    case 117002: // 雷达车
      return require('../models/RadarTruck/radar1.glb')
    case 117003: // 发射车
      return require('../models/LaunchTruck/launchTruck.glb')
    case 118001: // 基站
      return require('../models/Station/Station.glb')
    case 118002: // 建筑
      return require('../models/Building/Building.glb')
    default:
      return null
  }
}*/

export function getThreeDModelByType(type) {
  switch (type) {
    case 111008: // 舰艇 // 护卫舰
      return './models/Quzhujian/quzhujian.glb'
    case 111006: // 船  // 哨舰
      return './models/Quzhujian/quzhujian.glb'
    case 111009: // 驱逐舰
      return './models/Quzhujian/quzhujian.glb'
    case 111007: // 航母
      return './models/Carrier1/carrier.glb'
    case 112001: // 潜艇
      return './models/Submarine/submarine.glb'
    case 112002: // 鱼雷
      return './models/YL/YL.glb'
    case 114001: // 战斗机
      return './models/Fighter/fighter.glb'
    case 114002: // 导弹
      return './models/Missile/missile.glb'
    case 113001: // 直18F
      return './models/Copter/copter.glb'
    case 116001: // 坦克
      return './models/Tank/tank.glb'
    case 116040: // 雷达
      return './models/Radar/radar.glb'
    case 117001: // 车
      return './models/GroundVehicle/car.glb'
    case 117002: // 雷达车
      return './models/RadarTruck/radarTruck.glb'
    case 117003: // 发射车
      return './models/LaunchTruck/launchTruck.glb'
    case 118001: // 基站
      return './models/Station/Station.glb'
    case 118002: // 建筑
      return './models/Building/Building.glb'
    default:
      return null
  }
}

// 获取模型类别
export function getModelType(type) {
  switch (type) {
    case 111008: // 舰艇
      return '护卫舰'
    case 111006: // 船
      return '哨舰'
    case 111009: // 驱逐舰
      return '驱逐舰'
    case 111007: // 航母
      return '航母'
    case 112001: // 潜艇
      return '潜艇'
    case 112002: // 鱼雷
      return '鱼雷'
    case 114001: // 战斗机
      return '战斗机'
    case 114002: // 导弹
      return '导弹'
    case 113001: // 直18F
      return '直18F'
    case 116001: // 坦克
      return '坦克'
    case 116040: // 雷达
      return '雷达'
    case 117001: // 车
      return '车'
    case 117002: // 车
      return '雷达车'
    case 117003: // 车
      return '发射车'
    case 118001: // 基站
      return '基站'
    case 118002: // 建筑
      return '建筑'
    default:
      return null
  }
}
