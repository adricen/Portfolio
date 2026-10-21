/**
 * Tests et validation du support WebGPU
 * Ce module permet de tester et valider que WebGPU est bien supporté
 * et que Three.js peut l'utiliser correctement.
 */

import { getThree, checkWebGpuSupport, checkWebGpuInThree, getRendererType } from './cache'

/**
 * Résultat du test WebGPU
 */
export interface WebGPUTestResult {
  /**
   * Le navigateur supporte WebGPU (navigator.gpu existe)
   */
  browserSupportsWebGPU: boolean
  
  /**
   * Three.js a WebGPURenderer disponible
   */
  threeHasWebGPURenderer: boolean
  
  /**
   * WebGPU peut être utilisé (les deux conditions ci-dessus sont vraies)
   */
  canUseWebGPU: boolean
  
  /**
   * Le renderer à utiliser ('webgpu' ou 'webgl')
   */
  rendererType: 'webgpu' | 'webgl'
  
  /**
   * Message d'erreur si WebGPU n'est pas disponible
   */
  errorMessage: string | null
  
  /**
   * Détails du support
   */
  details: {
    navigatorGpu?: any
    threeWebGPURenderer?: any
    adapter?: any
  }
}

/**
 * Teste de manière complète le support WebGPU
 * @returns Promise<WebGPUTestResult>
 */
export async function testWebGPUSupport(): Promise<WebGPUTestResult> {
  const result: WebGPUTestResult = {
    browserSupportsWebGPU: false,
    threeHasWebGPURenderer: false,
    canUseWebGPU: false,
    rendererType: 'webgl',
    errorMessage: null,
    details: {}
  }

  // Étape 1 : Vérifier le support du navigateur
  try {
    const gpu = (navigator as any).gpu
    result.browserSupportsWebGPU = !!gpu
    result.details.navigatorGpu = gpu
    
    if (gpu) {
      // Essayer de demander un adapter
      try {
        const adapter = await gpu.requestAdapter({
          powerPreference: 'high-performance'
        })
        result.details.adapter = adapter
      } catch (adapterError) {
        result.errorMessage = `Failed to request WebGPU adapter: ${adapterError}`
        console.warn('⚠️ WebGPU adapter request failed:', adapterError)
      }
    }
  } catch (error) {
    result.errorMessage = `Failed to check browser WebGPU support: ${error}`
    console.warn('⚠️ Browser WebGPU check failed:', error)
  }

  // Étape 2 : Vérifier que Three.js a WebGPURenderer
  try {
    const THREE = await getThree()
    result.threeHasWebGPURenderer = !!(THREE as any).WebGPURenderer
    result.details.threeWebGPURenderer = (THREE as any).WebGPURenderer
  } catch (error) {
    result.errorMessage = `Failed to check Three.js WebGPU support: ${error}`
    console.warn('⚠️ Three.js WebGPU check failed:', error)
  }

  // Étape 3 : Déterminer si on peut utiliser WebGPU
  result.canUseWebGPU = result.browserSupportsWebGPU && result.threeHasWebGPURenderer
  
  // Étape 4 : Déterminer le renderer à utiliser
  if (result.canUseWebGPU) {
    result.rendererType = 'webgpu'
  } else {
    result.rendererType = 'webgl'
    if (!result.browserSupportsWebGPU) {
      result.errorMessage = 'Browser does not support WebGPU (navigator.gpu not available)'
    } else if (!result.threeHasWebGPURenderer) {
      result.errorMessage = 'Three.js does not have WebGPURenderer available'
    }
  }

  return result
}

/**
 * Teste la création effective d'un WebGPURenderer
 * @returns Promise<{ success: boolean, renderer?: any, error?: string, fallbackRenderer?: any }>
 */
export async function testWebGPURendererCreation(): Promise<{
  success: boolean
  renderer?: any
  error?: string
  fallbackRenderer?: any
}> {
  const result = {
    success: false,
    renderer: undefined,
    error: undefined,
    fallbackRenderer: undefined
  }

  try {
    const THREE = await getThree()
    const WebGPURenderer = (THREE as any).WebGPURenderer
    
    if (!WebGPURenderer) {
      result.error = 'WebGPURenderer not available in Three.js'
      return result
    }

    // Créer un canvas temporaire
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    try {
      // Essayer de créer un WebGPURenderer
      const renderer = new WebGPURenderer({
        canvas,
        antialias: false
      })
      
      result.success = true
      result.renderer = renderer
      
      // Nettoyer
      renderer.dispose()
      
      return result
    } catch (error) {
      result.error = `WebGPURenderer creation failed: ${error}`
      
      // Essayer le fallback WebGL
      try {
        const fallbackRenderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false
        })
        result.fallbackRenderer = fallbackRenderer
        fallbackRenderer.dispose()
      } catch (fallbackError) {
        result.error += ` | Fallback WebGLRenderer also failed: ${fallbackError}`
      }
      
      return result
    }
  } catch (error) {
    result.error = `Test failed: ${error}`
    return result
  }
}

/**
 * Teste le support WebGPU et retourne un rapport détaillé
 * @returns Promise<WebGPUTestResult & { rendererTest: Awaited<ReturnType<typeof testWebGPURendererCreation>> }>
 */
export async function getWebGPUStatus(): Promise<WebGPUTestResult & {
  rendererTest: Awaited<ReturnType<typeof testWebGPURendererCreation>>
}> {
  const supportTest = await testWebGPUSupport()
  const rendererTest = await testWebGPURendererCreation()
  
  return {
    ...supportTest,
    rendererTest
  }
}

/**
 * Affiche un rapport de diagnostic WebGPU dans la console
 */
export async function logWebGPUDiagnostics(): Promise<void> {
  console.log('🔍 WebGPU Diagnostics')
  console.log('===================')
  
  const status = await getWebGPUStatus()
  
  console.log(`Browser supports WebGPU: ${status.browserSupportsWebGPU ? '✅' : '❌'}`)
  console.log(`Three.js has WebGPURenderer: ${status.threeHasWebGPURenderer ? '✅' : '❌'}`)
  console.log(`Can use WebGPU: ${status.canUseWebGPU ? '✅' : '❌'}`)
  console.log(`Renderer type: ${status.rendererType}`)
  
  if (status.rendererTest.success) {
    console.log(`WebGPURenderer creation: ✅`)
  } else {
    console.log(`WebGPURenderer creation: ❌`)
    console.log(`Error: ${status.rendererTest.error}`)
  }
  
  if (status.errorMessage) {
    console.log(`Error: ${status.errorMessage}`)
  }
  
  console.log('===================')
}

/**
 * Vérifie si WebGPU est disponible et peut être utilisé
 * @returns Promise<boolean>
 */
export async function isWebGPUAvailable(): Promise<boolean> {
  const status = await getWebGPUStatus()
  return status.canUseWebGPU && status.rendererTest.success
}
