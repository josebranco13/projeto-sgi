import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let cena = new THREE.Scene();
let camara = new THREE.PerspectiveCamera(70, 800 / 600, 0.1, 500);
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('meuCanvas') });

renderer.setSize(800, 600);
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

camara.position.set(6, 4, 7);
camara.lookAt(0, 0, 0);

let controlos = new OrbitControls(camara, renderer.domElement);

const relogio = new THREE.Clock();
const latencia_minima = 1 / 60;
let delta = 0;
let misturador = new THREE.AnimationMixer(cena);

let acao = null;
let acao2 = null;
let acao3 = null;
let alvo = null;

// Create a spotlight
let luz = new THREE.SpotLight("white", 5);
luz.position.set(0, 0, 0);
luz.angle = Math.PI / 6; // Spotlight cone angle
luz.penumbra = 0.5; // Soft edge of the spotlight
luz.decay = 2; // How quickly the light dims
luz.distance = 50; // Maximum range of the light
luz.castShadow = true;
cena.add(luz);

// Add a helper to visualize the spotlight
let luzhelper = new THREE.SpotLightHelper(luz);
cena.add(luzhelper);

function animar() {
    requestAnimationFrame(animar);
    delta += relogio.getDelta();

    if (delta < latencia_minima) {
        return;
    }

    if (alvo) {
        // Update spotlight position and target
        luz.position.copy(alvo.position);
        luz.target.position.copy(alvo.position.clone().add(new THREE.Vector3(0, -1, 0)));
        luzhelper.update();
    }

    misturador.update(Math.floor(delta / latencia_minima) * latencia_minima);
    renderer.render(cena, camara);
    delta = delta % latencia_minima;
}
animar();

// Load the GLTF model
let carregador = new GLTFLoader();
carregador.load('projeto_SGI_quarto.glb', function (gltf) {
    cena.add(gltf.scene);

    let clipe = THREE.AnimationClip.findByName(gltf.animations, 'LongArmAction');
    acao = misturador.clipAction(clipe);
    acao.play();

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'ShortArmAction');
    acao2 = misturador.clipAction(clipe);
    acao2.play();

    clipe = THREE.AnimationClip.findByName(gltf.animations, 'SupportJointAction');
    acao3 = misturador.clipAction(clipe);
    acao3.play();

    cena.traverse(function (x) {
        if (x.isMesh) {
            x.castShadow = true;
            x.receiveShadow = true;
            if (x.name === "Spot") {
                alvo = x;
            }
        }
    });
});

// Add UI controls
document.getElementById('btn_play').onclick = function () {
    acao.play();
    acao2.play();
    acao3.play();
};

document.getElementById('btn_pause').onclick = function () {
    acao.paused = !acao.paused;
    acao2.paused = !acao2.paused;
};

document.getElementById('btn_stop').onclick = function () {
    acao.stop();
    acao2.stop();
    acao3.stop();
};

document.getElementById('btn_reverse').onclick = function () {
    acao.timeScale = -acao.timeScale;
    acao2.timeScale = -acao2.timeScale;
    acao3.timeScale = -acao3.timeScale;
};

document.getElementById('menu_loop').onchange = function () {
    switch (this.value) {
        case '1':
            acao.clampWhenFinished = true;
            acao.setLoop(THREE.LoopOnce);
            acao2.clampWhenFinished = true;
            acao2.setLoop(THREE.LoopOnce);
            break;
        case '2':
            acao.setLoop(THREE.LoopRepeat);
            acao2.setLoop(THREE.LoopRepeat);
            break;
        case '3':
            acao.setLoop(THREE.LoopPingPong);
            acao2.setLoop(THREE.LoopPingPong);
    }
};
