//get attributes we created in model class particlesGeometry
attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;
uniform float uScale;

void main() {
  vPosition = position;

  float time = uTime * 4.;

  //we cant manipulate variables that we are passed, so we make a referenz of position
  vec3 pos = position;
  //now we can manipulate...sinus fn make a movement from -1 to 1..illusion of clockwise rotation
  pos.x += sin(time * aRandom.x) * 0.01;
  pos.y += sin(time * aRandom.y) * 0.01;
  pos.z += sin(time * aRandom.z) * 0.01;

  //uScale modifed by gsap, custom is 0 and we see nothing
  pos.x *= uScale + (sin(pos.y * 4. + time) * (1. - uScale));
  pos.y *= uScale + (cos(pos.z * 4. + time) * (1. - uScale));
  pos.z *= uScale + (sin(pos.x * 4. + time) * (1. - uScale));

  pos *= uScale;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 1.0 / -mvPosition.z;
}