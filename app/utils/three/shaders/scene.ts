/**
 * Scènes WebGPU avec shaders animés
 * Optimisé pour les backgrounds avec effets visuels
 */

import type * as THREE from 'three'
import { getThree, getRendererType, checkWebGpuSupport } from '../cache'
import { createFullScreenAnimatedShader } from './tsl'

/**
 * Options pour une scène avec shader animé
 */
export interface AnimatedShaderSceneOptions {
  canvas: HTMLCanvasElement
  backgroundColor?: THREE.ColorRepresentation
  antialias?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
  maxPixelRatio?: number
  /**
   * Mode de couleur pour le shader
   * @default 'rgb'
   */
  colorMode?: 'hsv' | 'rgb' | 'wave'
  /**
   * Couleur de base
   * @default 0xff0000
   */
  baseColor?: number
  /**
   * Vitesse de l'animation
   * @default 1.0
   */
  speed?: number
  /**
   * Amplitude de l'oscillation
   * @default 0.5
   */
  amplitude?: number
  /**
   * Force WebGL2 (désactive WebGPU)
   * @default false
   */
  forceWebGL?: boolean
}

/**
 * Scène avec shader animé
 */
export interface AnimatedShaderScene {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  mesh: THREE.Mesh
  material: THREE.Material
  canvas: HTMLCanvasElement
  animate: () => void
  dispose: () => void
  updateTime: (delta: number) => void
}

/**
 * Crée une scène WebGPU avec un shader animé
 * Utilise un full-screen quad avec un shader qui fait évoluer la couleur
 * 
 * @param options - Options de configuration
 * @returns Promise résolue avec l'objet AnimatedShaderScene
 */
export async function createAnimatedShaderScene(
  options: AnimatedShaderSceneOptions
): Promise<AnimatedShaderScene> {
  const {
    canvas,
    backgroundColor = 0x000000,
    antialias = true,
    powerPreference = 'high-performance',
    maxPixelRatio = Math.min(window.devicePixelRatio, 2),
    colorMode = 'rgb',
    baseColor = 0xff0000,
    speed = 1.0,
    amplitude = 0.5,
    forceWebGL = false
  } = options

  const THREE = await getThree()

  // Créer la scène
  const scene = new THREE.Scene()

  // Créer la caméra
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 1

  // Déterminer le type de renderer
  let renderer: THREE.WebGLRenderer
  const useWebGPU = !forceWebGL && (await getRendererType()) === 'webgpu'

  if (useWebGPU) {
    try {
      const WebGPURenderer = (THREE as any).WebGPURenderer
      
      if (!WebGPURenderer) {
        throw new Error('WebGPURenderer not available')
      }

      renderer = new WebGPURenderer({
        antialias,
        canvas,
        powerPreference
      }) as unknown as THREE.WebGLRenderer

      // Attendre que le contexte WebGPU soit prêt
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50) // Petit délai pour l'initialisation
      })

      console.log('✅ WebGPU renderer created for animated shader')
    } catch (e) {
      console.warn('⚠️ WebGPU initialization failed, falling back to WebGL2:', e)
      renderer = new THREE.WebGLRenderer({
        antialias,
        canvas,
        powerPreference
      })
    }
  } else {
    renderer = new THREE.WebGLRenderer({
      antialias,
      canvas,
      powerPreference
    })
    console.log('ℹ️ Using WebGL2 renderer (WebGPU forced off or not available)')
  }

  // Configurer le renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(maxPixelRatio)
  renderer.setClearColor(backgroundColor)

  // Créer le shader animé
  const material = await createFullScreenAnimatedShader({
    baseColor,
    speed,
    amplitude,
    colorMode
  })

  // Créer un full-screen quad
  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Variable pour le temps
  let time = 0

  // Animation loop
  let animationFrameId: number | null = null
  let lastTime = performance.now()

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    
    try {
      // Calculer le delta time
      const now = performance.now()
      const delta = (now - lastTime) / 1000 // en secondes
      lastTime = now
      
      // Mettre à jour le temps
      time += delta
      
      // Mettre à jour l'uniform time du shader
      if (material instanceof THREE.ShaderMaterial && material.uniforms.time) {
        material.uniforms.time.value = time
      }
      
      renderer.render(scene, camera)
    } catch (error) {
      console.error('❌ Error during render:', error)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }
  }

  // Démarrer l'animation
  setTimeout(() => {
    animate()
  }, 0)

  // Gestion du resize avec throttling
  let resizeTimeout: number | null = null
  const handleResize = () => {
    if (resizeTimeout) {
      cancelAnimationFrame(resizeTimeout)
    }
    resizeTimeout = requestAnimationFrame(() => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      resizeTimeout = null
    })
  }

  window.addEventListener('resize', handleResize, { passive: true })

  // Fonction pour mettre à jour le temps manuellement
  const updateTime = (delta: number) => {
    time += delta
    if (material instanceof THREE.ShaderMaterial && material.uniforms.time) {
      material.uniforms.time.value = time
    }
  }

  // Fonction de nettoyage
  const dispose = () => {
    // Arrêter l'animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    // Nettoyer le timeout de resize
    if (resizeTimeout !== null) {
      cancelAnimationFrame(resizeTimeout)
      resizeTimeout = null
    }

    // Retirer l'écouteur de resize
    window.removeEventListener('resize', handleResize)

    // Nettoyer le renderer
    try {
      renderer.dispose()
    } catch (error) {
      console.warn('⚠️ Error disposing renderer:', error)
    }

    // Nettoyer le matériau et la géométrie
    try {
      if (material instanceof THREE.Material) {
        material.dispose()
      }
      geometry.dispose()
    } catch (error) {
      console.warn('⚠️ Error disposing material/geometry:', error)
    }

    // Nettoyer la scène
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        try {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        } catch (error) {
          console.warn('⚠️ Error disposing mesh:', error)
        }
      }
    })
  }

  return {
    renderer,
    scene,
    camera,
    mesh,
    material,
    canvas,
    animate,
    dispose,
    updateTime
  }
}

/**
 * Crée une scène WebGPU optimisée pour un background avec shader animé
 * 
 * @param options - Options de configuration
 * @returns Promise résolue avec l'objet AnimatedShaderScene
 */
export async function createWebGPUBackgroundScene(
  options: AnimatedShaderSceneOptions
): Promise<AnimatedShaderScene> {
  // Pour un background, on limite le pixel ratio à 1 pour les performances
  return createAnimatedShaderScene({
    ...options,
    maxPixelRatio: 1,
    antialias: false
  })
}
