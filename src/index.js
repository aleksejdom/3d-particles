import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './Model'
/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  50, 
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );
controls.enabled = false;


/*------------------------------
Helpers
------------------------------*/
/* const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper ); */

/*------------------------------
Model
------------------------------*/
const skull = new Model({
  name: 'skull',
  file: './models/skull.glb',
  scene: scene,
  addOnload: true,
  color1: 'purple',
  color2: 'yellow'
})
const horse = new Model({
  name: 'horse',
  file: './models/horse.glb',
  scene: scene,
  color1: 'orange',
  color2: 'darkblue'
})

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('.button');
buttons[0].addEventListener('click', () => {
  skull.addObj()
  horse.removeObj()
})
buttons[1].addEventListener('click', () => {
  horse.addObj()
  skull.removeObj()
})


/*------------------------------
Clock Time
------------------------------*/
const clock = new THREE.Clock()
/*------------------------------

Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  if(skull.isModelActive){
    skull.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }
  if(horse.isModelActive){
    horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }
  
};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

/*------------------------------
Mouse Move
------------------------------*/

function onMouseMove(e){
  const x = e.clientX
  const y = e.clientY

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, .1, -1., x),
    x: gsap.utils.mapRange(0, window.innerHeight, .1, -1., y)
  })
}

window.addEventListener('mousemove', onMouseMove)
