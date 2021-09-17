import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'


export default class Model {
  constructor(obj) {
    //console.log('obj', obj)
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;
    this.addOnload = obj.addOnload;

    //handle if model completly loaded (to hande the time error in the animate fn in the index.js)
    this.isModelActive = false;


    this.color1 = obj.color1;
    this.color2 = obj.color2;

    this.loader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    //can find this in three js
    this.dracoLoader.setDecoderPath('./draco/')
    //load the dracoloader to gltf loader
    this.loader.setDRACOLoader(this.dracoLoader)

    //take care about uploading files
    this.init()
  }

  init() {
    this.loader.load(this.file, (response) => {

      // Original Mesh
  
      this.mesh = response.scene.children[0]
      console.log('mesh', this.mesh)

      this.particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          color1: { value: new THREE.Color(this.color1)},
          color2: { value: new THREE.Color(this.color2)},
          uTime: { value: 0 },
          uScale: { value: 0 }
        }
      })

      // Particles Geometry
      
      const sampler = new MeshSurfaceSampler(this.mesh).build()
      const numParticles = 20000
      this.particlesGeometry = new THREE.BufferGeometry()

      const particlesPosition = new Float32Array(numParticles * 3)
      //make random position
      const particlesRandomness = new Float32Array(numParticles * 3)

      for(let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3()
        sampler.sample(newPosition)
        particlesPosition.set([
          newPosition.x,
          newPosition.y,
          newPosition.z
        ], i * 3)
        particlesRandomness.set([
          Math.random() * 2 - 1, // -1 <> 1
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ], i * 3)
      }

      this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
      //make random position, 3 on the end becouse they contain vec3
      this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))

      console.log('particlesGeometry', this.particlesGeometry)

      // Particles
     
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

      // check if addOnload = true to load first mesh in scene
      if( this.addOnload ){
        this.addObj()
      }
    })
  }

  addObj(){
    this.scene.add(this.particles)

    //animate fade
    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 1,
      duration: 0.8,
      delay: .3,
      ease: 'power3.out'
    })

    if (!this.isModelActive) {
      gsap.fromTo(this.particles.rotation, {
        y: Math.PI
        }, {
        y: 0,
        duration: .8,
        ease: 'power3.out',
      })
    }

    this.isModelActive = true
  }

  removeObj(){

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 0,
      duration: 0.8,
      ease: 'power3.in',

      onComplete: () => {
        this.scene.remove(this.particles)
        this.isModelActive = false
      }
    })

    
    gsap.to(this.particles.rotation, {
      y: Math.PI
      }, {
        y: 0,
        duration: .8,
        ease: 'power3.out',
    })

  }
}