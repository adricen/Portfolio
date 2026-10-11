# ADR-001 : Stack Technique du Portfolio

## 📌 Statut
**Accepté** - Mis à jour le 2025-07-15 (version améliorée avec implémentations détaillées)

---

## 🎯 Contexte
Le portfolio doit positionner **Adrien Centonze** comme **Tech Lead / Software Architect – Real-Time 3D Web** avec 15 ans d'expérience. Le site lui-même doit **démontrer la maîtrise des technologies** et respecter un **budget de performance contractuel** :
- **60 FPS** sur toutes les pages
- **< 2 Mo JS gzippé**
- **Score Lighthouse ≥ 97** (Desktop) / **≥ 95** (Mobile)

---

## 📋 Table des Matières
1. [État Actuel](#-état-actuel)
2. [Décisions Techniques](#-décisions-techniques)
3. [Implémentation WebGPU + Fallback WebGL2](#-implémentation-webgpu--fallback-webgl2)
4. [Lazy Loading et Code Splitting](#-lazy-loading-et-code-splitting)
5. [Gestion des Assets 3D](#-gestion-des-assets-3d)
6. [Budget de Performance](#-budget-de-performance)
7. [Configuration CI/CD](#-configuration-cicd)
8. [Risques et Mitigations](#-risques-et-mitigations)
9. [Roadmap d'Implémentation](#-roadmap-dimplémentation)
10. [Liens](#-liens)

---

## ✅ État Actuel (vérifié le 2025-07-15)

### Technologies **déjà implémentées et à CONSERVER**

| Technologie | Version | Configuration | Statut | Vérification |
|-------------|---------|---------------|--------|---------------|
| **Framework** | Nuxt 4.5.2 | `nuxt.config.ts` | ✅ **DÉJÀ FAIT** | `grep "nuxt" package.json` |
| **Build Tool** | Vite | Intégré à Nuxt 4 | ✅ **DÉJÀ FAIT** | `grep "vite" package.json` |
| **TypeScript** | 5.x | **Mode STRICT déjà activé** par Nuxt 4 | ✅ **DÉJÀ FAIT** | Voir `.nuxt/tsconfig.app.json` |
| **Tailwind CSS** | @nuxtjs/tailwindcss 6.14.0 | `tailwind.config.js` + `nuxt.config.ts` | ✅ **DÉJÀ FAIT** | `grep "tailwindcss" nuxt.config.ts` |
| **@nuxt/content** | 3.16.0 | `content.config.ts` avec collection `articles` | ✅ **DÉJÀ FAIT** | `grep "@nuxt/content" nuxt.config.ts` |
| **ESLint** | 10.10.0 | `eslint.config.mjs` + `@nuxt/eslint` | ✅ **DÉJÀ FAIT** | `grep "eslint" package.json` |
| **Git/GitHub** | - | Repository public : `adricen/Portfolio` | ✅ **DÉJÀ FAIT** | `git remote -v` |

### 📁 Configuration actuelle vérifiée

#### **nuxt.config.ts** (extraits clés)
```typescript
// Modules activés
modules: [
  '@nuxt/eslint',      // ✅ Linting automatique
  '@nuxtjs/tailwindcss', // ✅ Styling
  '@nuxt/content',      // ✅ Gestion de contenu
]
```

#### **tsconfig.json** (root)
- Pointe vers `.nuxt/tsconfig.*.json` (généré par Nuxt)

#### **.nuxt/tsconfig.app.json** (généré)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitThis": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### **content.config.ts** (extraits)
```typescript
collections: {
  articles: defineCollection({
    source: 'articles/*.md',
    type: 'page',
    schema: z.object({...})
  }),
  // ⚠️ À ajouter : projets, taran-core, ia, a-propos
}
```

---

## 🔧 Décisions Techniques

### 🎯 **À AJOUTER** (pas encore implémenté)

| Élément | Version | Justification | Priorité | Agent Responsable |
|---------|---------|---------------|----------|-------------------|
| **Three.js** | r182+ | Rendering 3D (WebGPU + fallback WebGL2) | ⭐⭐⭐ | @threejs-agent |
| **@three-webgpu/renderer** | 0.182.0 | WebGPURenderer pour Three.js | ⭐⭐⭐ | @threejs-agent |
| **@types/three** | 0.182.0 | Typage TypeScript pour Three.js | ⭐⭐ | @threejs-agent |
| **@nuxtjs/color-mode** | 4.0.1 | **Déjà installé**, à activer dans nuxt.config | ⭐⭐ | @nuxt-agent |
| **@nuxt/image** | 1.5.0 | Optimisation des images (WebP, lazy loading) | ⭐⭐ | @nuxt-agent |
| **GitHub Actions** | - | CI/CD + vérification budget perf | ⭐⭐⭐ | @devops-agent |

### 🔧 **À CONFIGURER** (existe mais pas configuré)

| Élément | Configuration nécessaire | Priorité | Agent Responsable |
|---------|---------------------------|----------|-------------------|
| **nuxt.config.ts** | Ajouter `target: 'static'` pour SSG | ⭐⭐⭐ | @nuxt-agent |
| **nuxt.config.ts** | Activer `@nuxtjs/color-mode` | ⭐⭐ | @nuxt-agent |
| **nuxt.config.ts** | Ajouter `@nuxt/image` | ⭐⭐ | @nuxt-agent |
| **content.config.ts** | Ajouter collections : `projets`, `taran-core`, `ia`, `a-propos` | ⭐⭐⭐ | @contenu-agent |
| **tailwind.config.js** | Compléter la configuration theme (dark mode, couleurs) | ⭐ | @ui-agent |
| **Budget perf** | Afficher dans footer (60fps, <2Mo, 97+ Lighthouse) | ⭐⭐⭐ | @perf-agent |

### 🏗️ **À CRÉER** (manquant)

| Élément | Description | Agent Responsable |
|---------|-------------|-------------------|
| **.github/workflows/** | GitHub Actions pour CI/CD + Lighthouse | @devops-agent |
| **/projets** | Index des études de cas (6 max, filtrables) | @contenu-agent |
| **/projets/[slug]** | Études de cas (trame 6 blocs, voir [ADR-002](002-architecture-pages.md)) | @contenu-agent |
| **/taran-core** | ECS + benchmarks + playground live | @taran-agent |
| **/ia** | RAG local + 3D×IA | @ia-agent |
| **/a-propos** | Timeline 15 ans + leadership + témoignages | @contenu-agent |
| **/contact** | Email + LinkedIn + créneau 15 min | @contenu-agent |
| **Hero 3D** | WebGPU + fallback WebGL2, accessible, <3s mobile | @threejs-agent |

---

## 🖥️ Implémentation WebGPU + Fallback WebGL2

### Détection du support WebGPU
WebGPU n'est pas supporté sur tous les navigateurs (voir [caniuse.com/webgpu](https://caniuse.com/webgpu)).
**Solution** : Détection dynamique + fallback automatique.

#### Code de détection
```typescript
// utils/three/webgpu-detection.ts
let supportsWebGPU: boolean | null = null;

export async function checkWebGPUSupport(): Promise<boolean> {
  if (supportsWebGPU !== null) return supportsWebGPU;
  
  try {
    // Vérification basique
    if (!navigator.gpu) return false;
    
    // Vérification avancée avec Three.js
    const THREE = await import('three');
    supportsWebGPU = await THREE.WebGPURenderer.isAvailable();
    return supportsWebGPU;
  } catch {
    supportsWebGPU = false;
    return false;
  }
}
```

#### Pattern de fallback dans les composants 3D
```typescript
// composables/useThreeRenderer.ts
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';
import * as THREE from 'three';

export function useThreeRenderer(canvasRef: Ref<HTMLCanvasElement | null>) {
  const renderer = ref<THREE.WebGLRenderer | THREE.WebGPURenderer | null>(null);
  const scene = ref<THREE.Scene | null>(null);
  const isWebGPU = ref(false);

  onMounted(async () => {
    const THREE = await import('three');
    const supportsWebGPU = await checkWebGPUSupport();
    
    // Initialisation du renderer
    if (supportsWebGPU && !process.env.FORCE_WEBGL) {
      try {
        const WebGPURenderer = (await import('@three-webgpu/renderer')).WebGPURenderer;
        renderer.value = new WebGPURenderer({
          canvas: canvasRef.value!,
          antialias: true,
          alpha: true,
        });
        isWebGPU.value = true;
      } catch {
        // Fallback si WebGPU échoue
        renderer.value = new THREE.WebGLRenderer({
          canvas: canvasRef.value!,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
      }
    } else {
      renderer.value = new THREE.WebGLRenderer({
        canvas: canvasRef.value!,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    }

    // Configuration commune
    renderer.value.setPixelRatio(window.devicePixelRatio);
    renderer.value.setSize(window.innerWidth, window.innerHeight);
    scene.value = new THREE.Scene();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.value?.render(scene.value!, new THREE.Camera());
    };
    animate();
  });

  onBeforeUnmount(() => {
    // Nettoyage des ressources
    renderer.value?.dispose();
    scene.value?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  });

  return { renderer, scene, isWebGPU };
}
```

#### Feature Flag pour le debug
Dans `nuxt.config.ts` :
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Désactive WebGPU pour le debug (ex: FORCE_WEBGL=true npm run dev)
      forceWebGL: process.env.FORCE_WEBGL === 'true',
    },
  },
});
```

---

## 📦 Lazy Loading et Code Splitting

### Pourquoi ?
- **Three.js** pèse ~500 Ko (gzippé).
- **@three-webgpu/renderer** ajoute ~200 Ko.
- **Objectif** : Ne charger ces dépendances **que quand nécessaire** (ex: pages avec 3D).

### Configuration Vite (dans nuxt.config.ts)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Chunks séparés pour Three.js
          manualChunks: {
            three: ['three', '@types/three'],
            threeWebGPU: ['@three-webgpu/renderer'],
          },
        },
      },
    },
  },
});
```

### Pattern pour les composants 3D
Utiliser `defineAsyncComponent` pour charger les composants 3D **uniquement quand ils sont affichés** :

```typescript
// components/three/HeroScene.vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// Chargement lazy du composant 3D
const AsyncHeroScene = defineAsyncComponent(() =>
  import('./HeroSceneImpl.vue').catch(() =>
    // Fallback si le chargement échoue
    import('./HeroSceneFallback.vue')
  )
);

// Désactiver la 3D si l'utilisateur préfère le mode réduit
const show3D = ref(false);

onMounted(() => {
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    show3D.value = !mediaQuery.matches;
    
    // Écouter les changements
    mediaQuery.addEventListener('change', (e) => {
      show3D.value = !e.matches;
    });
  }
});
</script>

<template>
  <ClientOnly>
    <AsyncHeroScene v-if="show3D" />
    <HeroStaticImage v-else /> <!-- Alternative pour les utilisateurs qui désactivent la 3D -->
  </ClientOnly>
</template>
```

### Vérification du bundle
```bash
# Analyser le bundle après build
npx nuxi analyze
```
**Objectif** : Vérifier que `three` et `@three-webgpu/renderer` apparaissent dans des chunks séparés (ex: `three-[hash].js`).

---

## 🎨 Gestion des Assets 3D

### Formats recommandés
| Format | Utilisation | Avantages | Inconvénients |
|--------|-------------|-----------|---------------|
| **GLB** | Modèles statiques | Tout-en-un, facile à charger | Moins flexible |
| **GLTF + Draco** | Modèles complexes | Compression jusqu'à 80% | Nécessite le decoder Draco |
| **Texture Atlas** | Textures multiples | Réduit le nombre de draw calls | Complexité de création |

### Stockage
- **Assets < 100 Ko** : Dans `/public/models/` (ex: `/public/models/hero.glb`).
- **Assets > 100 Ko** : **Lazy-loaded** depuis un CDN (ex: GitHub Pages, Cloudflare R2).

### Chargement optimisé
```typescript
// composables/useGLTFLoader.ts
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

// Cache global pour éviter de recharger les mêmes modèles
const modelCache = new Map<string, Promise<THREE.Group>>();

export function useGLTFLoader() {
  const loadModel = async (url: string): Promise<THREE.Group> => {
    if (!modelCache.has(url)) {
      const promise = new Promise<THREE.Group>(async (resolve, reject) => {
        try {
          const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
          const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
          
          const loader = new GLTFLoader();
          
          // Configuration Draco (si nécessaire)
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
          loader.setDRACOLoader(dracoLoader);
          
          loader.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            (error) => reject(error)
          );
        } catch (error) {
          reject(error);
        }
      });
      modelCache.set(url, promise);
    }
    return modelCache.get(url)!;
  };

  return { loadModel };
}
```

### Exemple d'utilisation
```typescript
// components/three/ModelViewer.vue
<script setup lang="ts">
import { useGLTFLoader } from '~/composables/useGLTFLoader';

const { loadModel } = useGLTFLoader();
const model = ref<THREE.Group | null>(null);

onMounted(async () => {
  try {
    model.value = await loadModel('/models/my-model.glb');
  } catch (error) {
    console.error('Erreur de chargement du modèle:', error);
  }
});
</script>
```

---

## ⚡ Budget de Performance (Contractuel)

### Cibles à afficher dans le footer
```
Ce site : 60 FPS | < 2 Mo JS gzippé | ≥ 97 Lighthouse (Desktop) | ≥ 95 Lighthouse (Mobile)
```

### Seuils détaillés

| Métrique | Seuil | Outil de vérification | Fréquence |
|----------|-------|----------------------|-----------|
| **Lighthouse (Desktop)** | ≥ 97 | Lighthouse CI | À chaque PR |
| **Lighthouse (Mobile)** | ≥ 95 | Lighthouse CI | À chaque PR |
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | Web Vitals | À chaque PR |
| **FID (First Input Delay)** | ≤ 100ms | Web Vitals | À chaque PR |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | Web Vitals | À chaque PR |
| **Bundle JS (gzippé)** | ≤ 2 Mo | `npx nuxi analyze` | À chaque PR |
| **FPS (Hero 3D)** | ≥ 60 | Chrome DevTools | Test manuel sur mobile |
| **Temps de chargement (3G)** | ≤ 5s | WebPageTest | Test manuel |

### Configuration Lighthouse CI

#### Fichier `.lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/projets",
        "http://localhost:3000/taran-core"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "performance": ["error", {"minScore": 0.97}],
        "best-practices": ["error", {"minScore": 0.97}],
        "accessibility": ["error", {"minScore": 0.9}],
        "seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

#### Workflow GitHub Actions (`.github/workflows/lighthouse.yml`)
```yaml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/projets
            http://localhost:3000/taran-core
          uploadArtifacts: true
          configPath: ./.lighthouserc.json
          assertions: |
            preset: lighthouse:recommended
            assertions:
              - uses: lighthouse:audit
                property: performance
                minScore: 0.97
              - uses: lighthouse:audit
                property: best-practices
                minScore: 0.97
```

---

## 🚀 Configuration CI/CD

### Workflows GitHub Actions

#### 1. Build et Déploiement (`.github/workflows/deploy.yml`)
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run analyze # Vérification du bundle
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .output/public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

#### 2. Vérification des PR (`.github/workflows/pr-checks.yml`)
```yaml
name: PR Checks
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run eslint .

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test

  lighthouse:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: http://localhost:3000
          uploadArtifacts: true
          configPath: ./.lighthouserc.json
```

---

## ⚠️ Risques et Mitigations

| Risque | Probabilité | Impact | Mitigation | Responsable |
|--------|-------------|--------|------------|-------------|
| **WebGPU non supporté sur certains navigateurs** | Moyenne | Élevé | Fallback WebGL2 + feature flag | @threejs-agent |
| **Bundle > 2 Mo** | Faible | Élevé | Code splitting + lazy loading + vérification automatique | @perf-agent |
| **Performance mobile insuffisante** | Moyenne | Élevé | Tests sur devices réels + Lighthouse CI + optimisation des assets | @perf-agent |
| **Incohérences entre ADR** | Moyenne | Moyen | Index des ADR + vérification automatique | @orchestrateur |
| **Three.js non compatible avec Nuxt 4** | Faible | Élevé | Utiliser `defineAsyncComponent` + SSR-safe | @nuxt-agent |
| **Assets 3D trop lourds** | Moyenne | Moyen | Compression Draco + CDN + lazy loading | @threejs-agent |
| **Lighthouse CI bloquant les PR** | Moyenne | Moyen | Seuils réalistes + tests locaux avant push | @devops-agent |

---

## 📅 Roadmap d'Implémentation

### Phase 1 : Infrastructure (Semaine 1-2)
- [ ] Activer `@nuxtjs/color-mode` dans `nuxt.config.ts`
- [ ] Ajouter `@nuxt/image` et configurer
- [ ] Ajouter Three.js r182+ + `@types/three` + `@three-webgpu/renderer`
- [ ] Configurer `target: 'static'` dans `nuxt.config.ts`
- [ ] Configurer code splitting pour Three.js dans `vite.build.rollupOptions`
- [ ] Créer `.github/workflows/` pour CI/CD (Lighthouse, build, deploy)
- [ ] Configurer `.lighthouserc.json`

### Phase 2 : Contenu & 3D (Semaine 2-3)
- [ ] Configurer collections @nuxt/content : `projets`, `taran-core`, `ia`, `a-propos`
- [ ] Créer le Hero 3D (WebGPU + fallback WebGL2) avec `useThreeRenderer`
- [ ] Implémenter le budget de performance dans le footer
- [ ] Créer les pages : `/projets`, `/taran-core`, `/ia`, `/a-propos`, `/contact`
- [ ] Ajouter `useGLTFLoader` pour le chargement des assets 3D

### Phase 3 : Études de cas (Semaine 3-4)
- [ ] Créer les études de cas selon la [trame 6 blocs (ADR-002)](002-architecture-pages.md)
- [ ] Ajouter les extracts interactifs embarqués (pour les NDA)
- [ ] Vérifier le budget de performance avec Lighthouse CI

### Phase 4 : Finalisation (Semaine 5-6)
- [ ] Tests performance sur mobile réel (iOS/Android)
- [ ] Relecture complète des ADR et du code
- [ ] Publication + annonce LinkedIn

---

## 🔗 Liens
- [ADR-002 : Architecture des Pages](./002-architecture-pages.md) *(Dépend de ce document)*
- [Brief initial](../cahier-des-charges.md)
- [Backlog](../tasks.md)
- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Three.js r182 Documentation](https://threejs.org/docs)
- [WebGPU Support Table](https://caniuse.com/webgpu)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 📝 Historique
| Version | Date | Auteur | Modifications |
|---------|------|--------|----------------|
| 1.0 | 2024-10-02 | orchestrateur | Création initiale + audit réaliste |
| 2.0 | 2025-07-15 | orchestrateur | Ajout des sections : Implémentation WebGPU, Lazy Loading, Assets 3D, Risques, CI/CD |

---
*Créé par : orchestrateur*  
*Date : 2024-10-02*  
*Mis à jour : 2025-07-15 (version améliorée)*
