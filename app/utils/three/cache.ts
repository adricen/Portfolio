/**
 * Cache global pour Three.js et WebGPU
 * Évite les imports multiples et l'initialisation répétée
 */

let threeModule: typeof import('three') | null = null
let webgpuSupported: boolean | null = null
let webgpuAvailableInThree: boolean | null = null
let webgpuRendererTested: boolean = false
let webgpuRendererWorks: boolean = false

/**
 * Vérifie si WebGPU est supporté par le navigateur
 * @returns Promise<bool> - true si WebGPU est supporté
 */
export async function checkWebGpuSupport(): Promise<boolean> {
  if (webgpuSupported !== null) {
    return webgpuSupported
  }

  // Vérification native du support WebGPU
  // navigator.gpu est une API expérimentale, vérifier son existence
  const gpu = (navigator as any).gpu
  if (!gpu) {
    webgpuSupported = false
    return false
  }

  try {
    const adapter = await gpu.requestAdapter({
      powerPreference: 'high-performance'
    })
    webgpuSupported = !!adapter
    return webgpuSupported
  } catch (error) {
    webgpuSupported = false
    return false
  }
}

/**
 * Vérifie si WebGPURenderer est disponible dans Three.js
 * @returns Promise<bool> - true si disponible
 */
export async function checkWebGpuInThree(): Promise<boolean> {
  if (webgpuAvailableInThree !== null) {
    return webgpuAvailableInThree
  }

  const THREE = await getThree()
  webgpuAvailableInThree = !!(THREE as any).WebGPURenderer
  return webgpuAvailableInThree
}

/**
 * Teste si WebGPURenderer peut être créé avec succès
 * @returns Promise<bool> - true si la création réussit
 */
export async function testWebGPURendererCreation(): Promise<boolean> {
  if (webgpuRendererTested) {
    return webgpuRendererWorks
  }

  try {
    const THREE = await getThree()
    const WebGPURenderer = (THREE as any).WebGPURenderer
    
    if (!WebGPURenderer) {
      webgpuRendererWorks = false
      webgpuRendererTested = true
      return false
    }

    // Créer un canvas temporaire
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    try {
      const renderer = new WebGPURenderer({
        canvas,
        antialias: false
      })
      
      // Nettoyer
      renderer.dispose()
      
      webgpuRendererWorks = true
      webgpuRendererTested = true
      return true
    } catch (error) {
      webgpuRendererWorks = false
      webgpuRendererTested = true
      return false
    }
  } catch (error) {
    webgpuRendererWorks = false
    webgpuRendererTested = true
    return false
  }
}

/**
 * Charge Three.js avec cache global
 * @returns Promise<typeof THREE>
 */
export async function getThree(): Promise<typeof import('three')> {
  if (threeModule) {
    return threeModule
  }

  // Import dynamique avec cache
  threeModule = await import('three')
  return threeModule
}

/**
 * Réinitialise le cache (utile pour les tests)
 */
export function resetThreeCache(): void {
  threeModule = null
  webgpuSupported = null
  webgpuAvailableInThree = null
  webgpuRendererTested = false
  webgpuRendererWorks = false
}

/**
 * Détermine quel renderer utiliser
 * Prend en compte :
 * 1. Le support du navigateur (navigator.gpu)
 * 2. La disponibilité de WebGPURenderer dans Three.js
 * 3. La capacité à créer effectivement un WebGPURenderer
 * 
 * @param options - Options supplémentaires
 * @returns Promise<'webgpu' | 'webgl'>
 */
export async function getRendererType(options: {
  forceWebGL?: boolean
  forceWebGPU?: boolean
} = {}): Promise<'webgpu' | 'webgl'> {
  const { forceWebGL = false, forceWebGPU = false } = options

  // Si on force WebGL, retourner webgl
  if (forceWebGL) {
    return 'webgl'
  }

  // Si on force WebGPU, vérifier qu'il est disponible
  if (forceWebGPU) {
    const supported = await checkWebGpuSupport()
    const inThree = await checkWebGpuInThree()
    const works = await testWebGPURendererCreation()
    
    if (supported && inThree && works) {
      return 'webgpu'
    }
    return 'webgl'
  }

  // Vérifier d'abord le support natif du navigateur
  const gpuSupported = await checkWebGpuSupport()
  if (!gpuSupported) {
    return 'webgl'
  }

  // Vérifier si Three.js a WebGPURenderer
  const webgpuInThree = await checkWebGpuInThree()
  if (!webgpuInThree) {
    return 'webgl'
  }

  // Tester si on peut créer un WebGPURenderer
  const rendererWorks = await testWebGPURendererCreation()
  if (!rendererWorks) {
    return 'webgl'
  }

  return 'webgpu'
}

/**
 * Vérifie si WebGPU est complètement disponible et fonctionnel
 * @returns Promise<bool>
 */
export async function isWebGPUFullyAvailable(): Promise<boolean> {
  const supported = await checkWebGpuSupport()
  const inThree = await checkWebGpuInThree()
  const works = await testWebGPURendererCreation()
  
  return supported && inThree && works
}
