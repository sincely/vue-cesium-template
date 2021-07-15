/*eslint-disable*/

const Cesium = require('cesium/Cesium')

let viewModel = {
  emissionRate: 200.0,
  gravity: 0.0,
  minimumParticleLife: 1.5,
  maximumParticleLife: 1.8,
  minimumSpeed: 7.0,
  maximumSpeed: 9.0,
  startScale: 3.0,
  endScale: 1.5,
  particleSize: 2,
}

var particleSystem = scene.primitives.add(
  new Cesium.ParticleSystem({
    image: '../../assets/fire4.png',
    startColor: new Cesium.Color(1, 1, 1, 1),
    endColor: new Cesium.Color(0.5, 0, 0, 0),
    startScale: viewModel.startScale,
    endScale: viewModel.endScale,
    minimumParticleLife: viewModel.minimumParticleLife,
    maximumParticleLife: viewModel.maximumParticleLife,
    minimumSpeed: viewModel.minimumSpeed,
    maximumSpeed: viewModel.maximumSpeed,
    imageSize: new Cesium.Cartesian2(
      viewModel.particleSize,
      viewModel.particleSize
    ),
    emissionRate: viewModel.emissionRate,
    lifetime: 6.0,
    //循环是否开启
    loop: true,
    emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
    // emitterModelMatrix: computeEmitterModelMatrix(),
    // updateCallback: applyGravity,
    sizeInMeters: true,
  })
)

var pos1 = Cesium.Cartesian3.fromDegrees(116.39079313032, 39.9919830785419, 0)
var entity = viewer.entities.add({
  position: pos1,
})

viewer.scene.preUpdate.addEventListener(function (scene, time) {
  particleSystem.modelMatrix = computeModelMatrix(entity, time)
  // Account for any changes to the emitter model matrix.
  particleSystem.emitterModelMatrix = computeEmitterModelMatrix()
})

function computeModelMatrix(entity, time) {
  return entity.computeModelMatrix(time, new Cesium.Matrix4())
}

var emitterModelMatrix = new Cesium.Matrix4()
var translation = new Cesium.Cartesian3()
var rotation = new Cesium.Quaternion()
var hpr = new Cesium.HeadingPitchRoll()
var trs = new Cesium.TranslationRotationScale()

//改变粒子系统的位置
function computeEmitterModelMatrix() {
  hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr)
  trs.translation = Cesium.Cartesian3.fromElements(0, 0, 86, translation)
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation)
  return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix)
}
