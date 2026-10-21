import type * as THREE from 'three'
import { getThree, getRendererType, checkWebGpuSupport } from './cache'

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
  /**
   * Limite le pixel ratio pour éviter les performances excessives
   * @default Math.min(window.devicePixelRatio, 2)
   */
  maxPixelRatio?: number
  /**
   * Désactive WebGPU et force WebGL2 (utile pour le debugging)
   * @default false
   */
  forceWebGL?: boolean
}

/**
 * Crée une scène Three.js de base avec WebGPU (fallback WebGL2)
 * Optimisé pour les performances :
 * - Cache du module Three.js
 * - Détection précoce du support WebGPU
 * - Pixel ratio limité pour éviter le sur-rendu
 * - Initialisation asynchrone propre
 * 
 * @param options - Options de configuration de la scène
 * @returns Promise résolue avec l'objet ThreeScene
 */
export async function createBaseScene(options: ThreeSceneOptions): Promise<ThreeScene> {
  const {
    canvas,
    backgroundColor = 0x000000,
    antialias = true,
    powerPreference = 'high-performance',
    maxPixelRatio = Math.min(window.devicePixelRatio, 2),
    forceWebGL = false
  } = options

  // Charger THREE depuis le cache (évite les imports multiples)
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
  camera.position.z = 5

  // Déterminer le type de renderer à utiliser
  let renderer: THREE.WebGLRenderer
  const useWebGPU = !forceWebGL && (await getRendererType()) === 'webgpu'

  if (useWebGPU) {
    try {
      // WebGPU avec initialisation asynchrone propre
      const WebGPURenderer = (THREE as any).WebGPURenderer
      
      // Vérifier que le canvas est valide
      if (!canvas) {
        throw new Error('Canvas element is required')
      }

      // Créer le renderer WebGPU
      renderer = new WebGPURenderer({
        antialias,
        canvas,
        powerPreference
      }) as unknown as THREE.WebGLRenderer

      // Attendre que le contexte WebGPU soit prêt
      // Three.js WebGPURenderer peut avoir besoin de temps pour initialiser
      await new Promise<void>((resolve, reject) => {
        // Vérifier si le renderer a une méthode pour attendre la disponibilité
        if (typeof (renderer as any).init === 'function') {
          (renderer as any).init().then(resolve).catch(reject)
        } else {
          // Si pas de méthode init, on suppose que c'est prêt
          // Mais on ajoute un petit délai pour être sûr
          setTimeout(resolve, 10)
        }
      })

    } catch (e) {
      console.warn('⚠️ WebGPU initialization failed, falling back to WebGL2:', e)
      // Fallback WebGL2
      renderer = new THREE.WebGLRenderer({
        antialias,
        canvas,
        powerPreference
      })
    }
  } else {
    // WebGPU non disponible ou forcé WebGL, utiliser WebGL2
    renderer = new THREE.WebGLRenderer({
      antialias,
      canvas,
      powerPreference
    })
  }

  // Configurer le renderer avec pixel ratio limité
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(maxPixelRatio) // ⚡ Limité à max 2 pour éviter le sur-rendu
  renderer.setClearColor(backgroundColor)

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

  // Animation loop
  let animationFrameId: number | null = null
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    try {
      renderer.render(scene, camera)
    } catch (error) {
      console.error('❌ Error during render:', error)
      // Arrêter l'animation en cas d'erreur
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }
  }

  // Démarrer l'animation après que tout soit prêt
  // Utiliser setTimeout pour laisser le temps au navigateur de respirer
  setTimeout(() => {
    animate()
  }, 0)

  // Écouteur de resize
  window.addEventListener('resize', handleResize, { passive: true })

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

    // Nettoyer la scène
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        try {
          obj.geometry.dispose()
        } catch (error) {
          console.warn('⚠️ Error disposing geometry:', error)
        }
        const material = obj.material
        if (Array.isArray(material)) {
          material.forEach((m) => {
            try {
              m.dispose()
            } catch (error) {
              console.warn('⚠️ Error disposing material:', error)
            }
          })
        } else if (material) {
          try {
            material.dispose()
          } catch (error) {
            console.warn('⚠️ Error disposing material:', error)
          }
        }
        // Nettoyer les textures des matériaux
        if (material) {
          if (Array.isArray(material)) {
            material.forEach((m) => {
              if (m instanceof THREE.Material) {
                Object.values(m).forEach((prop: any) => {
                  if (prop instanceof THREE.Texture) {
                    try {
                      prop.dispose()
                    } catch (error) {
                      console.warn('⚠️ Error disposing texture:', error)
                    }
                  }
                })
              }
            })
          } else if (material instanceof THREE.Material) {
            Object.values(material).forEach((prop: any) => {
              if (prop instanceof THREE.Texture) {
                try {
                  prop.dispose()
                } catch (error) {
                  console.warn('⚠️ Error disposing texture:', error)
                }
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
 * Optimisée pour le background (pas d'objets 3D, juste le clear color)
 * 
 * @param options - Options de configuration
 * @returns Promise résolue avec l'objet ThreeScene
 */
export async function createSimpleScene(options: ThreeSceneOptions): Promise<ThreeScene> {
  // Pour une scène simple, on force WebGL2 car WebGPU n'apporte rien
  // pour un simple clear color (et il est plus lent à initialiser)
  return createBaseScene({ ...options, forceWebGL: true })
}

/**
 * Crée une scène ultra-légère pour le background
 * Utilise WebGL2 uniquement (plus rapide à initialiser)
 * Pixel ratio limité à 1 pour les performances maximales
 * 
 * @param options - Options de configuration
 * @returns Promise résolue avec l'objet ThreeScene
 */
export async function createBackgroundScene(options: ThreeSceneOptions): Promise<ThreeScene> {
  return createBaseScene({
    ...options,
    forceWebGL: true, // WebGPU n'est pas nécessaire pour un background simple
    maxPixelRatio: 1, // Pas besoin de haute résolution pour un background
    antialias: false // Désactiver l'antialiasing pour le background
  })
}
