import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/*
Uma cena Three.js
Um canvas 800x600
Uma câmara na posição inicial (4, 3, 2)
OrbitControls
Uma cena fornecida (em glTF)
Um ponto de luz branca (PointLight), na posição (3, 4, 0) e com uma intensidade de 30
*/
let cena = new THREE.Scene();
let camara = new THREE.PerspectiveCamera(70, 800/600, 0.1, 500);

let misturador = new THREE.AnimationMixer(cena)
let acao = null
let acao2 = null
let acao3 = null

let meuCanvas = document.getElementById( 'meuCanvas' );

let renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } );
renderer.setSize(800, 600);
renderer.shadowMap.enabled = true;

camara.position.set(6,4,7);
camara.lookAt(0, 0, 0);

let controlos = new OrbitControls(camara, renderer.domElement);

const relogio = new THREE.Clock();
const latencia_minima = 1 / 60;
let delta = 0;

function animar() {
    requestAnimationFrame(animar);
    delta += relogio.getDelta();

    if (delta < latencia_minima) {
        return;
    }

    misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    renderer.render(cena, camara)
    delta = delta % latencia_minima
}
animar();

let carregador = new GLTFLoader()
carregador.load(
 'projeto_SGI_quarto.glb',
 function ( gltf ) {
    cena.add( gltf.scene )

    let clipe = THREE.AnimationClip.findByName(gltf.animations, 'LongArmAction')
    acao = misturador.clipAction(clipe)
    acao.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'ShortArmAction')
    acao2 = misturador.clipAction(clipe)
    acao2.play()

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'SupportJointAction')
    acao3 = misturador.clipAction(clipe)
    acao3.play()
 }
)

document.getElementById('btn_play').onclick = function(){
    acao.play()
    acao2.play()
    acao3.play()
}

document.getElementById('btn_pause').onclick = function(){
    acao.paused = !acao.paused
    acao2.paused = !acao2.paused
}

document.getElementById('btn_stop').onclick = function(){
    acao.stop()
    acao2.stop()
    acao3.stop()
}

document.getElementById('btn_reverse').onclick = function(){
    acao.timeScale = -acao.timeScale
    acao2.timeScale = -acao2.timeScale
    acao3.timeScale = -acao3.timeScale
}

document.getElementById('menu_loop').onchange = function(){
    switch(this.value){
        case '1':
            acao.clampWhenFinished = true
            acao.setLoop(THREE.LoopOnce)
            acao2.clampWhenFinished = true
            acao2.setLoop(THREE.LoopOnce)
            break
        case '2':
            acao.setLoop(THREE.LoopRepeat)
            acao2.setLoop(THREE.LoopRepeat)
            break
        case '3':
            acao.setLoop(THREE.LoopPingPong)
            acao2.setLoop(THREE.LoopPingPong)
    }
}

let luz = new THREE.PointLight("white", 10);
luz.position.set(5, 3, 5);
cena.add(luz);

luz.castShadow = true