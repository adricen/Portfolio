/**
 * Shaders TSL (Three.js Shading Language) pour WebGPU
 * 
 * TSL est le nouveau système de shading de Three.js pour WebGPU
 * Il permet d'écrire des shaders de manière déclarative
 */

import type * as THREE from 'three'
import { getThree } from '../cache'

/**
 * Crée un matériau avec un shader TSL simple qui anime une couleur
 * La couleur évolue en fonction du temps (sinusoïdale)
 * 
 * @param options - Options du shader
 * @returns Promise résolue avec le matériau
 */
export async function createAnimatedColorShaderMaterial(options: {
  baseColor?: number
  speed?: number
  amplitude?: number
} = {}): Promise<THREE.Material> {
  const THREE = await getThree()
  const { baseColor = 0xff0000, speed = 1.0, amplitude = 0.5 } = options

  // Pour WebGPU, Three.js utilise NodeMaterial avec TSL
  // Mais TSL n'est pas encore stable dans Three.js r160+
  // On va utiliser un ShaderMaterial classique avec GLSL pour la compatibilité
  // tout en préparant pour TSL
  
  // Vérifier si on peut utiliser NodeMaterial (TSL)
  const NodeMaterial = (THREE as any).NodeMaterial
  const TSL = (THREE as any).TSL
  
  if (NodeMaterial && TSL) {
    try {
      // Créer un shader TSL pour WebGPU
      // TSL est encore expérimental, donc on utilise une approche hybride
      const material = new NodeMaterial()
      
      // Créer des nodes TSL
      const timeNode = new (THREE as any).UniformNode(new THREE.Uniform(0))
      const speedNode = new (THREE as any).FloatNode(speed)
      const amplitudeNode = new (THREE as any).FloatNode(amplitude)
      
      // Calculer l'oscillation : sin(time * speed) * amplitude
      const timeScaled = new (THREE as any).OperatorNode(
        timeNode,
        speedNode,
        (THREE as any).OperatorNode.MULT
      )
      const sinWave = new (THREE as any).MathNode(timeScaled, 'sin')
      const oscillation = new (THREE as any).OperatorNode(
        sinWave,
        amplitudeNode,
        (THREE as any).OperatorNode.MULT
      )
      
      // Ajouter l'oscillation à la couleur de base
      const baseColorNode = new (THREE as any).ColorNode(new THREE.Color(baseColor))
      const finalColor = new (THREE as any).OperatorNode(
        baseColorNode,
        oscillation,
        (THREE as any).OperatorNode.ADD
      )
      
      // Appliquer à l'albedo
      material.colorNode = finalColor
      material.type = 'MeshBasicNodeMaterial'
      
      return material
    } catch (error) {
      console.warn('⚠️ TSL/NodeMaterial not available, falling back to ShaderMaterial:', error)
    }
  }

  // Fallback : ShaderMaterial avec GLSL (compatible WebGL2 et WebGPU)
  // Ce shader sera compilé pour WebGPU automatiquement par Three.js
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(baseColor) },
      speed: { value: speed },
      amplitude: { value: amplitude }
    },
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform float speed;
      uniform float amplitude;
      varying vec2 vUv;
      
      void main() {
        // Calculer l'oscillation en fonction du temps
        float oscillation = sin(time * speed) * amplitude;
        
        // Ajouter l'oscillation à chaque canal de couleur
        vec3 finalColor = baseColor + vec3(oscillation);
        
        // S'assurer que la couleur reste dans [0, 1]
        finalColor = clamp(finalColor, 0.0, 1.0);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  })

  return material
}

/**
 * Crée un shader TSL pour un full-screen quad (background)
 * Plus optimisé pour les backgrounds
 * 
 * @param options - Options du shader
 * @returns Promise résolue avec le matériau
 */
export async function createFullScreenAnimatedShader(options: {
  baseColor?: number
  speed?: number
  amplitude?: number
  colorMode?: 'hsv' | 'rgb' | 'wave'
} = {}): Promise<THREE.Material> {
  const THREE = await getThree()
  const { baseColor = 0xff0000, speed = 1.0, amplitude = 0.5, colorMode = 'rgb' } = options

  // Fallback ShaderMaterial pour compatibilité
  const baseColorVec = new THREE.Color(baseColor)
  
  let fragmentShader = `
    uniform float time;
    uniform vec3 baseColor;
    uniform float speed;
    uniform float amplitude;
    varying vec2 vUv;
    
    // Fonction pour convertir HSV à RGB
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec3 finalColor = baseColor;
      
  `

  switch (colorMode) {
    case 'hsv':
      fragmentShader += `
        // Animation HSV : faire tourner la teinte
        float hue = fract(time * speed * 0.1);
        vec3 hsvColor = vec3(hue, 0.8, 0.8);
        finalColor = hsv2rgb(hsvColor);
      `
      break
    case 'wave':
      fragmentShader += `
        // Animation wave : vague de couleur
        float wave = sin(vUv.x * 10.0 + time * speed) * amplitude;
        finalColor = baseColor + vec3(wave);
        finalColor = clamp(finalColor, 0.0, 1.0);
      `
      break
    default: // 'rgb'
      fragmentShader += `
        // Animation RGB : oscillation sur chaque canal
        float oscillation = sin(time * speed) * amplitude;
        finalColor = baseColor + vec3(oscillation, oscillation * 0.7, oscillation * 0.4);
        finalColor = clamp(finalColor, 0.0, 1.0);
      `
  }

  fragmentShader += `
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: baseColorVec },
      speed: { value: speed },
      amplitude: { value: amplitude }
    },
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader,
    side: THREE.DoubleSide
  })

  return material
}

/**
 * Type pour les matériaux TSL/Node
 */
export type TSLMaterial = THREE.Material & {
  timeNode?: any
  updateTime?: (delta: number) => void
}
