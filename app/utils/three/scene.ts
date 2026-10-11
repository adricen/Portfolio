import type * as THREE from 'three'

/**
 * Types pour la scène Three.js de base
 */
export interface ThreeScene {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  canvas: HTMLCanvasElement
  animate: () => void
  dispose: () => void
}

export interface ThreeSceneOptions {
  canvas: HTMLCanvasElement
  backgroundColor?: THREE.ColorRepresentation
  antialias?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
}

/**
 * Charge THREE dynamiquement avec fallback WebGPU -> WebGL2
 */
async function loadThree(): Promise<typeof THREE> {
  const THREE = await import('three')
  return THREE
}

/**
 * Crée une scène Three.js de base avec WebGPU (fallback WebGL2)
 * @param options - Options de configuration de la scène
 * @returns Promise résolue avec l'objet ThreeScene
 */
export async function createBaseScene(options: ThreeSceneOptions): Promise<ThreeScene> {
  const { canvas, backgroundColor = 0x000000, antialias = true, powerPreference = 'high-performance' } = options
  
  // Charger THREE dynamiquement
  const THREE = await loadThree()
  
  // Créer la scène
  const scene = new THREE.Scene()
  
  // Créer la caméra
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // Créer le renderer avec fallback WebGPU -> WebGL2
  let renderer: THREE.WebGLRenderer
  
  // Vérifier si WebGPURenderer est disponible
  const WebGPURenderer = (THREE as any).WebGPURenderer
  
  if (WebGPURenderer) {
    try {
      // Essayer WebGPU d'abord
      renderer = new WebGPURenderer({
        antialias,
        canvas,
        powerPreference
      }) as unknown as THREE.WebGLRenderer
    } catch (e) {
      // Fallback WebGL2
      renderer = new THREE.WebGLRenderer({
        antialias,
        canvas,
        powerPreference
      })
    }
  } else {
    // WebGPU non disponible, utiliser WebGL2
    renderer = new THREE.WebGLRenderer({
      antialias,
      canvas,
      powerPreference
    })
  }
  
  // Configurer le renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(backgroundColor)
  
  // Gestion du resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  // Animation loop
  let animationFrameId: number | null = null
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  
  // Démarrer l'animation
  animate()
  
  // Écouteur de resize
  window.addEventListener('resize', handleResize)
  
  // Fonction de nettoyage
  const dispose = () => {
    // Arrêter l'animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    
    // Retirer l'écouteur de resize
    window.removeEventListener('resize', handleResize)
    
    // Nettoyer le renderer
    renderer.dispose()
    
    // Nettoyer la scène
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        const material = obj.material
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose())
        } else if (material) {
          material.dispose()
        }
        // Nettoyer les textures des matériaux
        if (material) {
          if (Array.isArray(material)) {
            material.forEach((m) => {
              if (m instanceof THREE.Material) {
                Object.values(m).forEach((prop: any) => {
                  if (prop instanceof THREE.Texture) {
                    prop.dispose()
                  }
                })
              }
            })
          } else if (material instanceof THREE.Material) {
            Object.values(material).forEach((prop: any) => {
              if (prop instanceof THREE.Texture) {
                prop.dispose()
              }
            })
          }
        }
      }
    })
  }
  
  return {
    renderer,
    scene,
    camera,
    canvas,
    animate,
    dispose
  }
}

/**
 * Crée une scène simple avec juste une couleur de fond
 * @param options - Options de configuration
 * @returns Promise résolue avec l'objet ThreeScene
 */
export async function createSimpleScene(options: ThreeSceneOptions): Promise<ThreeScene> {
  return createBaseScene(options)
}
