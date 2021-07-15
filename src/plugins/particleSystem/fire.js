/*eslint-disable*/
const Cesium = require('cesium/Cesium')

let gravityScratch = new Cesium.Cartesian3()
let emitterModelMatrix = new Cesium.Matrix4()
let translation = new Cesium.Cartesian3()
let rotation = new Cesium.Quaternion()
let hpr = new Cesium.HeadingPitchRoll()
let trs = new Cesium.TranslationRotationScale()
let viewModel = {
  emissionRate: 200.0,
  gravity: 0.0,
  minimumParticleLife: 3.5,
  maximumParticleLife: 1.8,
  minimumSpeed: 7.0,
  maximumSpeed: 9.0,
  startScale: 2.0,
  endScale: 0.5,
  particleSize: 5000,
}

function computeEmitterModelMatrix(entity, params) {
  /*if (entity.modelInfo && entity.modelInfo.hpr) {
    hpr = entity.modelInfo.hpr
  } else {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, -90.0, 0.0, hpr)
  }*/
  if (params) {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(
      params.azimuth, // 方位角/偏航角
      params.pitch, // 俯仰角
      0.0, // 翻滚角
      hpr
    )
  } else {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, -90.0, 0.0, hpr)
  }

  trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, translation)
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation)

  return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix)
}

function computeModelMatrix(entity, time) {
  return entity.computeModelMatrix(time, new Cesium.Matrix4())
}

function applyGravity(p, dt) {
  // We need to compute a local up vector for each particle in geocentric space.
  let position = p.position

  Cesium.Cartesian3.normalize(position, gravityScratch)
  Cesium.Cartesian3.multiplyByScalar(
    gravityScratch,
    viewModel.gravity * dt,
    gravityScratch
  )

  p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity)
}

export function getExplosion(viewer, entity, params) {
  const scene = viewer.scene
  let particleSystem = scene.primitives.add(
    new Cesium.ParticleSystem({
      image: require('./fire.png'),

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

      /*bursts: [
        // these burst will occasionally sync to create a multicolored effect
        new Cesium.ParticleBurst({
          time: 5.0,
          minimum: 0,
          maximum: 20,
        }),
        new Cesium.ParticleBurst({
          time: 10.0,
          minimum: 10,
          maximum: 10,
        }),
        /!*new Cesium.ParticleBurst({
                    time: 15.0,
                    minimum: 200,
                    maximum: 300,
                }),*!/
      ],*/

      lifetime: 6.0,

      loop: true,

      // emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(10.0, 10.0, 10.0)),

      emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),

      emitterModelMatrix: computeEmitterModelMatrix(entity, params),

      updateCallback: applyGravity,

      sizeInMeters: true,
    })
  )

  viewer.scene.preUpdate.addEventListener(function (scene, time) {
    particleSystem.modelMatrix = computeModelMatrix(entity, time)

    // Account for any changes to the emitter model matrix.
    particleSystem.emitterModelMatrix = computeEmitterModelMatrix(entity)

    /*let height = Math.ceil(viewer.camera.positionCartographic.height)

    let zoom = height / entity.modelInfo.height

    // console.log(zoom)

    if (zoom > 0.6 && zoom < 2) {
      particleSystem.show = true
    } else {
      particleSystem.show = false
    }*/
  })

  let min = 100
  let max = 20 * min
  let origin = 10 * min

  setTimeout(() => {
    particleSystem.minimumImageSize.x = min
    particleSystem.minimumImageSize.y = min
    particleSystem.maximumImageSize.x = min
    particleSystem.maximumImageSize.y = min
  }, 0)

  setTimeout(() => {
    particleSystem.minimumImageSize.x = max
    particleSystem.minimumImageSize.y = max
    particleSystem.maximumImageSize.x = max
    particleSystem.maximumImageSize.y = max
  }, 1000)

  setTimeout(() => {
    particleSystem.minimumImageSize.x = origin
    particleSystem.minimumImageSize.y = origin
    particleSystem.maximumImageSize.x = origin
    particleSystem.maximumImageSize.y = origin

    // particleSystem.show = false
  }, 1500)

  setTimeout(() => {
    /*particleSystem.minimumImageSize.x = 0
    particleSystem.minimumImageSize.y = 0
    particleSystem.maximumImageSize.x = 0
    particleSystem.maximumImageSize.y = 0*/
    // particleSystem.show = false
    // particleSystem.modelMatrix = null
    viewer.scene.primitives.remove(particleSystem)
  }, 3500)

  return particleSystem
}
