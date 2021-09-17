
varying vec3 vPosition;

uniform vec3 color1;
uniform vec3 color2;

void main() {
vec3 newColor = mix(color1, color2, vPosition.z * 0.5 + 0.5);
 gl_FragColor = vec4(newColor, 1.0);
}