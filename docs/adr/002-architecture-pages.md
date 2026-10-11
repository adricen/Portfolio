# ADR-002 : Architecture des Pages du Portfolio

## 📌 Statut
**Accepté** - Mis à jour le 2025-07-15 (version améliorée avec templates, a11y, SEO et risques)

---

## 🎯 Contexte
Le portfolio doit refléter le positionnement **« Tech Lead / Software Architect – Real-Time 3D Web »** avec :
- Une **arborescence claire** pour les recruteurs.
- Des **études de cas structurées** (trame 6 blocs).
- Un **accès instantané** aux preuves techniques.

**Contraintes imposées** :
- **Règle des 2 clics** : Toute page → une étude de cas en ≤ 2 clics.
- **Contact en 1 clic** depuis toute page.
- **Budget de performance contractuel** (60 FPS, < 2 Mo JS gzippé, ≥ 97 Lighthouse) **affiché dans le footer** (voir [ADR-001](001-stack-technique.md)).

---

## 📋 Table des Matières
1. [Dépendances](#-dépendances)
2. [Arborescence Globale](#-arborescence-globale)
3. [Trame des Études de Cas](#-trame-des-études-de-cas)
4. [Spécifications par Page](#-spécifications-par-page)
5. [Navigation Transversale](#-navigation-transversale)
6. [Accessibilité (a11y)](#-accessibilité-a11y)
7. [SEO](#-seo)
8. [Templates et Exemples](#-templates-et-exemples)
9. [Risques et Mitigations](#-risques-et-mitigations)
10. [Conséquences](#-conséquences)
11. [Liens](#-liens)

---

## 🔗 Dépendances
Ce document **s'appuie sur [ADR-001 : Stack Technique](001-stack-technique.md)** pour :
- La **stack technique** (Nuxt 4, Three.js, WebGPU, Vite, etc.).
- Le **budget de performance** (60 FPS, < 2 Mo, ≥ 97 Lighthouse).
- Les **collections @nuxt/content** (`projets`, `taran-core`, `ia`, `a-propos`).
- Les **composables 3D** (`useThreeRenderer`, `useGLTFLoader`).

> ⚠️ **À lire avant** : [ADR-001 : Stack Technique](001-stack-technique.md)

---

## 🗺️ Arborescence Globale

```
/
├── /                    # Home : pitch + 3 projets vedettes + CTA études de cas/contact
│   ├── Hero 3D (WebGPU + fallback WebGL2, <3s mobile)
│   ├── Bandeau 3 chiffres (ex: "15 ans d'expérience", "60 FPS", "<2 Mo")
│   ├── 3 cartes projets vedettes (avec visuels interactifs)
│   └── CTA : "Voir toutes les études de cas" + "Me contacter"
│
├── /projets             # Index : 6 études de cas max (filtrables par catégorie)
│   ├── Filtres : [Tous | Industrie | Produit | R&D]
│   ├── Cartes : Image interactive + résultat chiffré + tags techno
│   └── CTA : "Voir le projet" (lien vers /projets/[slug])
│
├── /projets/[slug]      # Étude de cas (trame 6 blocs, voir §3)
│   ├── 1. CONTEXTE
│   ├── 2. DÉFI TECHNIQUE
│   ├── 3. DÉCISIONS
│   ├── 4. PERFORMANCE
│   ├── 5. RÉSULTAT MÉTIER
│   └── 6. CE QUE J'EN RETIRE
│
├── /taran-core          # Mini-page produit : ECS + benchmarks + playground live
│   ├── Pitch problème ECS
│   ├── Schéma architecture
│   ├── Tableau benchmarks (vs Babylon.js, Unity WebGL, etc.)
│   └── Playground live (éditeur de scène 3D simplifié)
│
├── /ia                  # RAG local + 3D×IA
│   ├── Schéma RAG (Embeddings → Vector DB → LLM)
│   ├── Choix technologiques (ex: Qdrant, Sentence Transformers)
│   ├── Stratégie d'évaluation (métriques : précision, latence, coût)
│   ├── Mesures : Coût/requête, latence moyenne
│   └── V2 : Intégration 3D×IA (ex: génération de scènes 3D par IA)
│
├── /a-propos            # Timeline 15 ans + leadership + témoignages
│   ├── Timeline interactive (2010 → 2025)
│   ├── Bloc "Leadership" (méthodologie, mentorat)
│   ├── 2-3 faits marquants (ex: "Architecte principal chez [Client]")
│   └── Témoignages (citations + liens LinkedIn)
│
└── /contact             # Direct : email, LinkedIn, créneau 15 min
    ├── Email : adricen@protonmail.com (lien mailto)
    ├── LinkedIn : lien vers profil + bouton "Message"
    └── Calendly : lien vers créneau 15 min
```

---

## 📝 Trame des Études de Cas (`/projets/[slug]`)

Chaque page suit **6 blocs obligatoires** (600-900 mots + visuels) :

### 1️⃣ **CONTEXTE**
- **Client/Produit** : Nom (anonymisé si NDA) + secteur (ex: "Start-up EdTech").
- **Besoin métier** : Problème à résoudre (ex: "Réduire le temps de chargement de la scène 3D").
- **Contraintes** : Budget, délai, compatibilité (ex: "Doit fonctionner sur mobile 3G").

### 2️⃣ **DÉFI TECHNIQUE**
- **Problème dur en une phrase** (ex: "La scène 3D met 8 secondes à charger sur mobile").
- **Impact** : Conséquences si non résolu (ex: "Taux de rebond à 70%").

### 3️⃣ **DÉCISIONS**
Tableau comparatif des choix d'architecture :

| Décision | Alternative rejetée | Raisons | Impact |
|----------|---------------------|---------|--------|
| Utiliser **InstancedMesh** | Geometry unique + merge | Réduction de 80% des draw calls | -80% draw calls |
| Charger les textures en **1024x1024** | 2048x2048 | Gain de 50% sur le poids | -50% bundle |
| **Lazy loading** des assets | Chargement synchrone | Évite le blocage du thread principal | +2s chargement |

### 4️⃣ **PERFORMANCE**
**Chiffres avant/après** (obligatoire) :
- **FPS** : 30 → **60** (x2)
- **Temps de chargement** : 8s → **1.8s** (-77%)
- **Draw calls** : 500 → **100** (-80%)
- **Bundle JS** : 2.5 Mo → **1.2 Mo** (-52%)

**Méthodologie** :
- Outils utilisés (ex: Chrome DevTools, WebPageTest).
- Environnement de test (ex: iPhone 12, 3G).

### 5️⃣ **RÉSULTAT MÉTIER**
**Chiffres obligatoires** :
- **Conversion** : +25% (mesuré via Google Analytics).
- **Temps passé sur page** : +40%.
- **Feedback client** : Citation (ex: "Nos utilisateurs adorent la fluidité !").

### 6️⃣ **CE QUE J'EN RETIRE**
- **Leçon 1** : Toujours tester sur mobile **avant** d'optimiser pour desktop.
- **Leçon 2** : Les **InstancedMesh** sont un game-changer pour les scènes avec beaucoup d'objets identiques.

---

### ⚠️ Règles pour les Études de Cas
1. **NDA** : Version anonymisée + **extrait interactif embarqué** (pas de captures seules).
2. **1 chiffre de perf + 1 chiffre métier minimum** par étude.
3. **Visuels** : Schémas, captures d'écran, GIFs (optimisés avec `@nuxt/image`).
4. **Longueur** : 600-900 mots (hors code).

---

## 📄 Spécifications par Page

| Page | Contenu Clé | Objectif | Budget Perf | Responsable |
|------|-------------|----------|-------------|-------------|
| **Home** | Hero 3D, bandeau 3 chiffres, 3 projets vedettes, CTA | Wow moment + crédibilité | < 1.5 Mo | @threejs-agent |
| **/projets** | 6 cartes (image interactive + résultat chiffré + tags), filtres | Navigation vers études de cas en 1 clic | < 1 Mo | @contenu-agent |
| **/taran-core** | Pitch ECS, schéma archi, benchmarks, playground | Preuve niveau "architecte" | < 1.8 Mo | @taran-agent |
| **/ia** | Schéma RAG, choix techno, coût/latence, v2 3D×IA | Maturité lead IA | < 1.5 Mo | @ia-agent |
| **/a-propos** | Timeline, leadership, témoignages | Cohérence trajectoire | < 0.5 Mo | @contenu-agent |
| **/contact** | Email, LinkedIn, créneau 15 min | Conversion simple | < 0.3 Mo | @contenu-agent |

---

## 🧭 Navigation Transversale

### Footer (sur toutes les pages)
```
© 2025 Adrien Centonze | Tech Lead 3D Web
Ce site : 60 FPS | < 2 Mo JS gzippé | ≥ 97 Lighthouse (Desktop) | ≥ 95 Lighthouse (Mobile)
[GitHub](https://github.com/adricen/Portfolio) | [LinkedIn](https://linkedin.com/in/adricen)
```

### Header
- **Logo** (lien vers `/`).
- **Navigation** : Lien vers `/projets`, `/taran-core`, `/ia`, `/a-propos`, `/contact`.
- **Bouton "Contact"** (visible sur toutes les pages, lien vers `/contact`).

### Breadcrumbs (dans `/projets/[slug]`)
```
Accueil > Projets > [Nom du projet]
[CTA "Projet suivant" en bas de page]
```

---

## ♿ Accessibilité (a11y)

### Règles Générales
- **WCAG 2.1 AA** : Respect obligatoire pour toutes les pages.
- **Contraste des couleurs** : ≥ 4.5:1 pour le texte, ≥ 3:1 pour les grands textes.
- **Navigation au clavier** : Toutes les fonctionnalités doivent être accessibles sans souris.
- **Focus visible** : Style CSS pour les éléments focusables (ex: `outline: 2px solid #3b82f6`).

### Spécificités par Page

#### Home
- **Hero 3D** :
  - Bouton "Désactiver la 3D" (pour `prefers-reduced-motion: reduce`).
  - Description textuelle alternative (ex: "Scène 3D représentant un cube en rotation avec des effets de lumière").
  - `aria-label` et `aria-describedby` pour les éléments interactifs.
- **Bandeau 3 chiffres** : Texte alternatif pour les icônes.

#### /projets
- **Cartes** :
  - `alt` descriptif pour les images (ex: "Capture d'écran du projet [Nom] montrant une scène 3D optimisée").
  - Navigation au clavier entre les cartes.

#### /projets/[slug]
- **Visuels** :
  - `alt` pour toutes les images.
  - Légendes pour les schémas.
- **Tableaux** : Utiliser `<th>` pour les en-têtes.

#### /taran-core
- **Playground live** :
  - Bouton "Désactiver l'éditeur" (pour les utilisateurs qui préfèrent le mode réduit).
  - Description textuelle des contrôles.

#### /ia
- **Schéma RAG** :
  - Texte alternatif pour le schéma (ex: "Schéma du pipeline RAG : Embeddings → Vector DB → LLM").
  - Légende détaillée.

### Outils de Vérification
- **axe-core** : Intégré à Lighthouse CI (voir [ADR-001](001-stack-technique.md)).
- **WAVE** : [https://wave.webaim.org/](https://wave.webaim.org/) (tests manuels).
- **NVDA/VoiceOver** : Tests avec lecteurs d'écran.

---

## 🔍 SEO

### Métadonnées Obligatoires
Utiliser le module `@nuxt/seo` (à ajouter dans [ADR-001](001-stack-technique.md)) pour générer automatiquement :
- **Titre** : `<title>[Titre] | Adrien Centonze - Tech Lead 3D Web</title>`
- **Description** : Meta description unique (150-160 caractères).
- **Open Graph** : Images et descriptions pour le partage sur LinkedIn/Twitter.
- **Canonical URL** : Éviter le duplicate content.

### Spécificités par Page

| Page | Titre | Description | Mots-clés | Image OG |
|------|-------|-------------|-----------|----------|
| **Home** | "Adrien Centonze - Tech Lead 3D Web" | "15 ans d'expérience en architecture 3D temps réel. Spécialiste WebGPU, Three.js et performance web." | "Tech Lead, 3D Web, WebGPU, Three.js, Performance" | `/images/og/home.jpg` |
| **/projets** | "Études de cas - Adrien Centonze" | "Découvrez mes projets en 3D temps réel : optimisation, architecture et innovation." | "Études de cas, 3D, Performance, Architecture" | `/images/og/projets.jpg` |
| **/projets/[slug]** | "[Titre] | Adrien Centonze" | "[Description courte du projet]. Découvrez comment j'ai [résultat clé]." | "[Tags], Étude de cas, 3D" | `/images/og/projets/[slug].jpg` |
| **/taran-core** | "Taran Core - ECS pour le Web 3D" | "Un framework ECS ultra-performant pour les applications 3D web. Benchmarks et playground live." | "ECS, 3D Web, Performance, Architecture" | `/images/og/taran-core.jpg` |
| **/ia** | "IA et 3D - Adrien Centonze" | "Intégration de l'IA dans les applications 3D : RAG local, génération de scènes, optimisation." | "IA, 3D, RAG, Machine Learning" | `/images/og/ia.jpg` |
| **/a-propos** | "À propos - Adrien Centonze" | "15 ans d'expérience en tant que Tech Lead 3D Web. Découvrez mon parcours et mes valeurs." | "Tech Lead, Architecture, 3D Web" | `/images/og/a-propos.jpg` |
| **/contact** | "Contact - Adrien Centonze" | "Contactez-moi pour discuter de vos projets 3D Web. Email, LinkedIn, créneau 15 min." | "Contact, Tech Lead, 3D Web" | `/images/og/contact.jpg` |

### Sitemap XML
Généré automatiquement par `@nuxt/seo` :
```xml
<!-- Exemple de sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://adricen.github.io/Portfolio/</loc>
    <lastmod>2025-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://adricen.github.io/Portfolio/projets</loc>
    <lastmod>2025-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### Outils de Vérification
- **Google Search Console** : Pour suivre les performances SEO.
- **Ahrefs/SEMrush** : Analyse des mots-clés.
- **Screaming Frog** : Audit SEO complet.

---

## 📑 Templates et Exemples

### 1. Template Markdown pour une Étude de Cas

**Fichier** : `/articles/projets/[slug].md`

```markdown
---
title: "Optimisation 3D pour [Client Anonymisé]"
slug: "optimisation-3d-client-x"
category: "Industrie" # ou "Produit" / "R&D"
date: "2025-07-15"
heroImage: "/images/projets/client-x/hero-800w.jpg"
tags: ["Three.js", "WebGL", "Performance", "InstancedMesh"]
chiffres:
  fps: { avant: 30, après: 60 }
  bundle: { avant: "2.5Mo", après: "1.2Mo" }
  drawCalls: { avant: 500, après: 100 }
  tempsChargement: { avant: "8s", après: "1.8s" }
resultatMetier:
  conversion: "+25%"
  tempsPage: "+40%"
  feedback: "Nos utilisateurs adorent la fluidité !"
---

## 1️⃣ CONTEXTE

**[Client Anonymisé]** est un leader dans le secteur de l'**EdTech**, avec une plateforme utilisée par plus de **10 000 étudiants** par jour. Leur produit phare, **[Nom du Produit]**, permet aux enseignants de créer des **expériences d'apprentissage interactives en 3D**.

**Besoin métier** :
- Réduire le **taux de rebond** (alors à 70%) sur les pages avec des scènes 3D.
- Améliorer l'**engagement** des utilisateurs (temps passé sur page < 2 min).

**Contraintes** :
- **Budget** : Pas de refonte complète (coût max : 20k€).
- **Délai** : 3 mois.
- **Compatibilité** : Doit fonctionner sur **mobile (iOS/Android)** et **navigateurs anciens** (Safari 14+).

---

## 2️⃣ DÉFI TECHNIQUE

> **"La scène 3D met 8 secondes à charger sur mobile, et le FPS chute à 15 en cas de mouvement."**

**Impact** :
- **70% des utilisateurs** quittent la page avant que la scène ne soit chargée.
- **Taux de conversion** en baisse de 40% sur mobile.

---

## 3️⃣ DÉCISIONS

| Décision | Alternative rejetée | Raisons | Impact |
|----------|---------------------|---------|--------|
| **Utiliser InstancedMesh** pour les objets répétitifs (ex: arbres, bâtiments) | Geometry unique + `BufferGeometry.merge()` | Réduction de **80% des draw calls** | -80% draw calls |
| **Compresser les textures** en 1024x1024 (au lieu de 2048x2048) | Garder les textures haute résolution | Gain de **50% sur le poids** des assets | -50% bundle |
| **Lazy loading** des assets 3D (chargement à la demande) | Chargement synchrone au démarrage | Évite le **blocage du thread principal** | +2s chargement |
| **Activer le fallback WebGL2** pour les navigateurs sans WebGPU | Forcer WebGPU | **Compatibilité universelle** | +10% couverture |
| **Utiliser Draco Compression** pour les modèles GLTF | Pas de compression | Réduction de **70% du poids** des modèles | -70% taille fichiers |

---

## 4️⃣ PERFORMANCE

### Chiffres avant/après

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| **FPS (mobile)** | 15-30 | **60** | x2 |
| **Temps de chargement** | 8s | **1.8s** | -77% |
| **Draw calls** | 500 | **100** | -80% |
| **Bundle JS** | 2.5 Mo | **1.2 Mo** | -52% |
| **Poids des assets 3D** | 15 Mo | **4.5 Mo** | -70% |

### Méthodologie
- **Outils** : Chrome DevTools, WebPageTest (3G), Lighthouse.
- **Environnement** : iPhone 12 (iOS 17), Chrome 120, connexion 3G simulée.
- **Tests** : 100 utilisateurs beta (via Firebase A/B Testing).

---

## 5️⃣ RÉSULTAT MÉTIER

### Chiffres clés
- **Taux de rebond** : 70% → **35%** (-50%)
- **Temps passé sur page** : 1m45 → **4m30** (+150%)
- **Taux de conversion** : +25% (mesuré via Google Analytics)
- **Feedback client** :
  > "Nos utilisateurs adorent la fluidité ! Le nombre de sessions par jour a doublé." — [Nom du Client], CTO

### Reconnaissance
- **Article** : "Comment [Client] a réduit son taux de rebond de 50%" (Medium, 5k vues).
- **Talk** : Présentation à la **3D Web Conf 2025** (slides disponibles [ici](#)).

---

## 6️⃣ CE QUE J'EN RETIRE

### Leçon 1 : Toujours tester sur mobile **avant** d'optimiser pour desktop
- **Problème** : J'avais optimisé la scène pour desktop (60 FPS), mais **oublié mobile**.
- **Solution** : Intégrer des **tests mobiles automatiques** dans le pipeline CI.
- **Outils** : BrowserStack, WebPageTest.

### Leçon 2 : Les InstancedMesh sont un game-changer
- **Problème** : 500 draw calls pour une scène avec 200 arbres identiques.
- **Solution** : Utiliser `THREE.InstancedMesh` pour réduire à **1 draw call**.
- **Gain** : +45 FPS sur mobile.

### Leçon 3 : Le lazy loading est obligatoire pour les assets lourds
- **Problème** : Chargement synchrone de 15 Mo de textures au démarrage.
- **Solution** : Charger les assets **à la demande** (quand l'utilisateur scroll vers la section 3D).
- **Gain** : Temps de chargement initial divisé par 3.

---

### Extrait Interactif Embarqué (pour NDA)

<iframe 
  src="/demos/client-x-optimisation" 
  title="Démonstration de l'optimisation 3D pour [Client]" 
  width="100%" 
  height="400px" 
  aria-label="Démonstration interactive de la scène 3D optimisée. Utilisez la souris pour naviguer."
></iframe>

*[Version anonymisée pour respecter le NDA. La démo montre une scène similaire avec les mêmes optimisations.]*
```

---

### 2. Template Vue pour une Page Projet

**Fichier** : `/pages/projets/[slug].vue`

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAsyncData } from '#imports';

// Récupération des données de l'étude de cas
const route = useRoute();
const { data: projet } = await useAsyncData(`projet-${route.params.slug}`, () =>
  queryContent('/projets').where({ slug: route.params.slug }).findOne()
);

// Métadonnées SEO (via @nuxt/seo)
useHead({
  title: `${projet.value?.title} | Adrien Centonze`,
  meta: [
    { name: 'description', content: projet.value?.description },
    { property: 'og:title', content: `${projet.value?.title} | Adrien Centonze` },
    { property: 'og:description', content: projet.value?.description },
    { property: 'og:image', content: projet.value?.heroImage },
    { name: 'keywords', content: projet.value?.tags?.join(', ') },
  ],
});

// Navigation entre projets
const { data: projets } = await useAsyncData('projets', () =>
  queryContent('/projets').find()
);

const currentIndex = projets.value?.findIndex(p => p.slug === route.params.slug);
const nextProjet = projets.value?.[currentIndex! + 1];
const prevProjet = projets.value?.[currentIndex! - 1];
</script>

<template>
  <div class="projet-page">
    <!-- Breadcrumbs -->
    <nav aria-label="Fil d'Ariane">
      <ol class="breadcrumbs">
        <li><NuxtLink to="/">Accueil</NuxtLink></li>
        <li><NuxtLink to="/projets">Projets</NuxtLink></li>
        <li aria-current="page">{{ projet?.title }}</li>
      </ol>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <h1>{{ projet?.title }}</h1>
      <p class="subtitle">{{ projet?.description }}</p>
      <div class="tags">
        <span v-for="tag in projet?.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <img 
        :src="projet?.heroImage" 
        :alt="`Image de couverture pour ${projet?.title}`" 
        loading="lazy"
      />
    </section>

    <!-- Contenu (Markdown) -->
    <ContentDoc class="content" />

    <!-- Chiffres clés -->
    <section class="chiffres" aria-label="Chiffres clés du projet">
      <h2>Chiffres Clés</h2>
      <div class="grid">
        <div v-if="projet?.chiffres?.fps" class="chiffre">
          <span class="valeur">{{ projet.chiffres.fps.apres }}</span>
          <span class="label">FPS (avant: {{ projet.chiffres.fps.avant }})</span>
        </div>
        <div v-if="projet?.chiffres?.bundle" class="chiffre">
          <span class="valeur">{{ projet.chiffres.bundle.apres }}</span>
          <span class="label">Bundle (avant: {{ projet.chiffres.bundle.avant }})</span>
        </div>
        <div v-if="projet?.resultatMetier?.conversion" class="chiffre">
          <span class="valeur">{{ projet.resultatMetier.conversion }}</span>
          <span class="label">Conversion</span>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <nav class="projet-nav" aria-label="Navigation entre projets">
      <NuxtLink v-if="prevProjet" :to="`/projets/${prevProjet.slug}`" class="prev">
        ← {{ prevProjet.title }}
      </NuxtLink>
      <NuxtLink to="/projets" class="all">Tous les projets</NuxtLink>
      <NuxtLink v-if="nextProjet" :to="`/projets/${nextProjet.slug}`" class="next">
        {{ nextProjet.title }} →
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
/* Styles spécifiques à la page projet */
.hero {
  text-align: center;
  margin-bottom: 2rem;
}
.hero img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
.tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}
.tag {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.chiffres {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.chiffre {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
}
.valeur {
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
}
.label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
}
.projet-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
</style>
```

---

### 3. Exemple de Configuration Nuxt pour le SEO

**Fichier** : `nuxt.config.ts` (extraits)

```typescript
// Ajouter @nuxt/seo dans les modules
export default defineNuxtConfig({
  modules: [
    '@nuxt/seo', // À ajouter (voir ADR-001)
    // ... autres modules
  ],
  
  // Configuration @nuxt/seo
  seo: {
    // Métadonnées par défaut
    defaultTitle: 'Adrien Centonze - Tech Lead 3D Web',
    defaultDescription: '15 ans d\'expérience en architecture 3D temps réel. Spécialiste WebGPU, Three.js et performance web.',
    defaultImage: '/images/og/default.jpg',
    
    // Open Graph
    openGraph: {
      type: 'website',
      siteName: 'Adrien Centonze - Portfolio',
      locale: 'fr_FR',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: '@adricen', // À remplacer par ton handle Twitter
    },
    
    // Sitemap
    sitemap: {
      hostname: 'https://adricen.github.io/Portfolio',
      exclude: ['/admin'], // Exclure les pages internes
    },
    
    // Robots.txt
    robots: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
  },
});
```

---

## ⚠️ Risques et Mitigations

| Risque | Probabilité | Impact | Mitigation | Responsable |
|--------|-------------|--------|------------|-------------|
| **Études de cas non cohérentes** | Moyenne | Moyen | Template Markdown + relecture systématique | @contenu-agent |
| **Performance mobile insuffisante** | Moyenne | Élevé | Tests sur devices réels + Lighthouse CI + optimisation des assets | @perf-agent |
| **NDA non respectés** | Faible | Élevé | Version anonymisée + extrait interactif embarqué | @contenu-agent |
| **SEO faible** | Moyenne | Moyen | Métadonnées optimisées + sitemap + vérification Google Search Console | @seo-agent |
| **Accessibilité non respectée** | Moyenne | Moyen | Tests avec WAVE + axe-core + lecteurs d'écran | @a11y-agent |
| **Contenu obsolète** | Moyenne | Moyen | Relecture trimestrielle + mise à jour des benchmarks | @contenu-agent |
| **Liens brisés** | Moyenne | Faible | Vérification automatique avec Screaming Frog | @devops-agent |

---

## ✅ Conséquences

### Avantages
- **Clarté** : Arborescence plate et intuitive pour les recruteurs.
- **Preuves tangibles** : Chaque page met en avant des **chiffres** (perf ou métier).
- **Cohérence** : La trame 6 blocs garantit une narration structurée.
- **Performance** : Respect du budget affiché dans le footer (auto-vérification via Lighthouse CI).
- **Accessibilité** : Respect WCAG 2.1 AA pour tous les utilisateurs.
- **SEO** : Optimisation pour les moteurs de recherche et les réseaux sociaux.

### Risques (déjà couverts dans le tableau ci-dessus)
- **NDA** : Certains projets nécessitent une version anonymisée + démo live générique.
- **Maintenance** : Les benchmarks (Taran Core) et métriques (études de cas) doivent être mis à jour régulièrement.

### Alternatives rejetées
| Alternative | Raisons du rejet |
|-------------|------------------|
| **Études de cas en PDF** | Non interactif, ne permet pas de démo live embarquée. |
| **Arborescence profonde** | Viole la règle des 2 clics. |
| **Formulaire de contact** | Moins direct qu'un email/LinkedIn + créneau. |
| **Pas de SEO** | Le portfolio ne serait pas trouvable sur Google/LinkedIn. |
| **Pas d'a11y** | Exclut les utilisateurs en situation de handicap. |

---

## 🔗 Liens
- [ADR-001 : Stack Technique](001-stack-technique.md) *(Ce document en dépend)*
- [Cahier des charges](../cahier-des-charges.md)
- [Backlog](../tasks.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Nuxt SEO Module](https://github.com/harlan-zw/nuxt-seo)

---

## 📝 Historique
| Version | Date | Auteur | Modifications |
|---------|------|--------|----------------|
| 1.0 | 2024-10-02 | orchestrateur | Création initiale |
| 2.0 | 2025-07-15 | orchestrateur | Ajout des sections : Dépendances, a11y, SEO, Templates, Risques |

---
*Créé par : orchestrateur*  
*Date : 2024-10-02*  
*Mis à jour : 2025-07-15 (version améliorée)*
