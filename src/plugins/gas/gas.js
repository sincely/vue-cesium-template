const Cesium = require('cesium/Cesium')

let gravityScratch = new Cesium.Cartesian3();
let emitterModelMatrix = new Cesium.Matrix4();
let translation = new Cesium.Cartesian3();
let rotation = new Cesium.Quaternion();
let hpr = new Cesium.HeadingPitchRoll();
let trs = new Cesium.TranslationRotationScale();
let viewModel = {
    emissionRate: 30,
    gravity: 1.0,
    minimumParticleLife:1,
    maximumParticleLife:1,
    minimumSpeed: 0,
    maximumSpeed: 1,
    startScale: 1,
    endScale: 1,
    particleSize: 40.0,
};

function computeEmitterModelMatrix(entity) {
    if(entity.modelInfo && entity.modelInfo.hpr) {
        hpr = entity.modelInfo.hpr
    } else {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
    }

    trs.translation = Cesium.Cartesian3.fromElements(
        3,
        0,
        0,
        translation
    );
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

    return Cesium.Matrix4.fromTranslationRotationScale(
        trs,
        emitterModelMatrix
    );
}

function computeModelMatrix(entity, time) {
    return entity.computeModelMatrix(time, new Cesium.Matrix4());
}

function applyGravity(p, dt) {
    // We need to compute a local up vector for each particle in geocentric space.
    let position = p.position;

    Cesium.Cartesian3.normalize(position, gravityScratch);
    Cesium.Cartesian3.multiplyByScalar(
        gravityScratch,
        viewModel.gravity * dt,
        gravityScratch
    );

    p.velocity = Cesium.Cartesian3.add(
        p.velocity,
        gravityScratch,
        p.velocity
    );
}

export function getGas(viewer, entity) {
    const scene = viewer.scene;
    let particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
            image: require('./smoke.png'),

            startColor: Cesium.Color.ORANGERED.withAlpha(0.9),
            endColor: Cesium.Color.WHITESMOKE.withAlpha(0.1),

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

            bursts: [
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
                /*new Cesium.ParticleBurst({
                    time: 15.0,
                    minimum: 200,
                    maximum: 300,
                }),*/
            ],

            lifetime: 16.0,

            emitter: new Cesium.CircleEmitter(1.0),

            emitterModelMatrix: computeEmitterModelMatrix(entity),

            updateCallback: applyGravity,
        })
    );

    viewer.scene.preUpdate.addEventListener(function (scene, time) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time);

        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix(entity);

        let height = Math.ceil(viewer.camera.positionCartographic.height);

        let zoom = height/ entity.modelInfo.height

        // console.log(zoom)

        if(zoom > 0.6 && zoom < 2 ) {
            particleSystem.show = true
        } else {
            particleSystem.show = false
        }
    });

}