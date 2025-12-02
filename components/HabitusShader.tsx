import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const HabitusShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.2, 0.0, 0.5),
    uAuthenticity: 0.0, // 0.0 = Factory (Toon), 1.0 = Craft (Physical/Glow)
    uLightDirection: new THREE.Vector3(1.0, 1.0, 1.0),
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uAuthenticity;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;

      // "Wobble" effect for Factory/Toon mode (uAuthenticity close to 0)
      float wobble = sin(position.y * 5.0 + uTime) * 0.05 * (1.0 - uAuthenticity);
      vec3 pos = position + normal * wobble;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uAuthenticity;
    uniform vec3 uLightDirection;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightDirection);
        vec3 viewDir = normalize(vViewPosition);

        // --- 1. FACTORY MODE (Toon Shading) ---
        float NdotL = dot(normal, lightDir);
        // Step function for hard bands
        float toon = step(0.0, NdotL) * 0.5 + 0.5;
        vec3 factoryColor = uColor * toon;

        // --- 2. CRAFT MODE (Iridescent / Fresnel) ---
        // Fresnel glow
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 3.0);
        vec3 craftColor = mix(uColor, vec3(0.0, 1.0, 1.0), fresnel);

        // Add some noise/grain to craft mode
        float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
        craftColor += noise * 0.05;

        // --- MIX ---
        vec3 finalColor = mix(factoryColor, craftColor, uAuthenticity);

        gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ HabitusShaderMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      habitusShaderMaterial: any;
    }
  }
}

export { HabitusShaderMaterial };
