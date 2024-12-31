import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let cena = new THREE.Scene();
let camara = new THREE.PerspectiveCamera(70, 800/500, 0.1, 500);

let misturador = new THREE.AnimationMixer(cena)
let acao1 = null
let acao2 = null
let acao3 = null
let acao4 = null
let acao5 = null

let meuCanvas = document.getElementById( 'meuCanvas' );

let renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } );
renderer.setSize(800, 500);
renderer.shadowMap.enabled = true;

camara.position.set(-1.5,12,0);


let controlos = new OrbitControls(camara, renderer.domElement);
controlos.target.set(-8, 11, 2);

camara.lookAt(new THREE.Vector3(-8 , 11, 2));

let S_LightBulb;
let Abajur;

let carregador = new GLTFLoader()
carregador.load(
 'projeto_SGI_quarto.glb',
 function ( gltf ) {
    cena.add( gltf.scene )

    S_LightBulb = gltf.scene.getObjectByName('S_LightBulb');
    Abajur = gltf.scene.getObjectByName('Abajur');

    let clipe = THREE.AnimationClip.findByName(gltf.animations, 'SupportJointAction')
    acao1 = misturador.clipAction(clipe)
    acao1.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'LongArmAction')
    acao2 = misturador.clipAction(clipe)
    acao2.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'ShortArmAction')
    acao3 = misturador.clipAction(clipe)
    acao3.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'ArmToAbajurJointAction')
    acao4 = misturador.clipAction(clipe)
    acao4.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'AbajurJointAction.001')
    acao5 = misturador.clipAction(clipe)
    acao5.play()
 }
)

const sliderSupportJoint = document.getElementById('animation-slider-supportjoint');
const sliderLongArm = document.getElementById('animation-slider-longarm');
const sliderShortArm = document.getElementById('animation-slider-shortarm');
const sliderArmToAbajur = document.getElementById('animation-slider-armtoabajur');
const sliderAbajur = document.getElementById('animation-slider-abajur');
const btnLight = document.getElementById('btn-light');

  document.getElementById('btn-light').onclick = function(){
    if (btnLight.textContent == "Turn light off") {
      lampSpotlight.intensity = 0;
      btnLight.textContent = "Turn light on"
    } else if (btnLight.textContent == "Turn light on"){
      lampSpotlight.intensity = 100;
      btnLight.textContent = "Turn light off"
    }
  }

sliderSupportJoint.addEventListener('input', () => {
  if (acao1) {
    const clipDuration = acao1.getClip().duration;
    const time = (sliderSupportJoint.value / 100) * clipDuration / 2 + clipDuration*0.25;
    acao1.time = time;
  }
});

sliderLongArm.addEventListener('input', () => {
  if (acao2) {
    const clipDuration = acao2.getClip().duration;
    const time = (sliderLongArm.value / 100) * clipDuration / 2 + clipDuration*0.25;
    acao2.time = time;
  }
});

sliderShortArm.addEventListener('input', () => {
  if (acao3) {
    const clipDuration = acao3.getClip().duration;
    const time = (sliderShortArm.value / 100) * clipDuration / 2 + clipDuration*0.25;
    acao3.time = time;
  }
});

sliderArmToAbajur.addEventListener('input', () => {
  if (acao4) {
    const clipDuration = acao4.getClip().duration;
    const time = (sliderArmToAbajur.value / 100) * clipDuration / 2 + clipDuration*0.25;
    acao4.time = time;
  }
});

sliderAbajur.addEventListener('input', () => {
  if (acao5) {
    const clipDuration = acao5.getClip().duration;
    const time = (sliderAbajur.value / 100) * clipDuration / 2 + clipDuration*0.25;
    acao5.time = time;
  }
});

let luzAmbiente = new THREE.AmbientLight("white", 0.05);
cena.add(luzAmbiente);

let lampSpotlight = new THREE.SpotLight(0xffffff, 100);
lampSpotlight.angle = Math.PI / 4;
lampSpotlight.penumbra = 0.5;
lampSpotlight.castShadow = true;
cena.add(lampSpotlight);


function animar() {
    requestAnimationFrame(animar);

    if (misturador) {
        misturador.update(0)
    }

    if (S_LightBulb && Abajur) {
        lampSpotlight.position.copy(Abajur.getWorldPosition(new THREE.Vector3()));
        lampSpotlight.target.position.copy(S_LightBulb.getWorldPosition(new THREE.Vector3()));
        lampSpotlight.target.updateMatrixWorld();
    }

    renderer.render(cena, camara)
}
animar();
