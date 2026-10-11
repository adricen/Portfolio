# Backlog — Plan 6 semaines

## État ACTUEL (vérifié le 2024-10-02)

### ✅ DÉJÀ FAIT (à conserver)
- Nuxt 4.5.2 + Vite (intégré)
- TypeScript **strict** (activé par Nuxt 4 dans .nuxt/tsconfig.*.json)
- Tailwind CSS via @nuxtjs/tailwindcss
- @nuxt/content v3.16.0 avec collection `articles`
- ESLint via @nuxt/eslint
- Repository GitHub public (adricen/Portfolio)
- Structure de base (app.vue, pages, components)

### ❌ À FAIRE (priorité)
- Three.js r182+ avec WebGPU/fallback WebGL2
- @nuxtjs/color-mode (installé mais non activé dans nuxt.config.ts)
- @nuxt/image (non installé)
- GitHub Actions CI/CD
- Mode static (target: 'static' dans nuxt.config.ts)
- Collections @nuxt/content : projets, taran-core, ia
- Pages : /projets, /projets/[slug], /taran-core, /ia, /contact
- Hero 3D interactif (accessible, <3s mobile)
- Budget de performance dans footer

## À décider (BLOQUANT - Semaine 1)
- [ ] Accord Wanadeov pour extraits + métriques [contenu]
- [ ] NDA : quels projets anonymisés, quelles démos embarquables ? [contenu]

## Semaine 1 : Infrastructure de base
- [ ] Configurer nuxt.config.ts : target: 'static', activer @nuxtjs/color-mode [web]
- [ ] Ajouter @nuxt/image et configurer [web]
- [ ] Ajouter Three.js r182+ + @types/three + @three-webgpu/renderer [threejs]
- [ ] Configurer code splitting pour Three.js dans vite [web]
- [ ] Configurer collections @nuxt/content : projets, taran-core, ia [contenu]

## Semaine 2 : CI/CD & Hero 3D
- [ ] Créer .github/workflows/ pour CI/CD + Lighthouse [web]
- [ ] Implémenter le budget de performance dans le footer [web]
- [ ] Créer le hero 3D (WebGPU + fallback WebGL2, accessible, <3s mobile) [threejs]
- [ ] Collecter métriques Wanadeov [contenu]
- [ ] Écrire le pitch (home + variantes) [contenu]

## Semaine 3 : Pages & Études de cas
- [ ] Créer page /projets (index avec filtres) [contenu]
- [ ] Créer page /taran-core (structure) [taran]
- [ ] Créer page /ia (structure) [contenu]
- [ ] Étude de cas XSIN-Luxov (ou extrait NDA anonymisé) [contenu]

## Semaine 4 : Taran Core & IA
- [ ] Page /taran-core : benchmarks comparatifs + playground live [taran]
- [ ] Page /ia : schéma RAG, évaluation, coût/latence, v2 3D×IA [contenu]
- [ ] Implémenter extracts interactifs embarqués pour chaque étude [threejs]

## Semaine 5 : Pages finales & Tests
- [ ] Page /a-propos (timeline 15 ans, leadership, témoignages) [contenu]
- [ ] Page /contact (email, LinkedIn, créneau 15 min) [contenu]
- [ ] Tests performance sur mobile réel (Lighthouse, WebPageTest) [web]
- [ ] Relecture complète + correction des liens internes [orchestrateur]

## Semaine 6 : Publication
- [ ] Vérification finale du budget de performance (60fps, <2Mo, 97+ Lighthouse) [web]
- [ ] Publication sur GitHub Pages [web]
- [ ] Annonce LinkedIn avec chiffre fort [contenu]
- [ ] Demander témoignages (manager, étudiant, client) [contenu]

## Priorités (si manque de temps)
1. Home avec hero 3D + CTA études de cas/contact
2. 3 études de cas principales (produit)
3. Page /contact

## Références
- [ADR-001 : Stack Technique](./adr/001-stack-technique.md) - État actuel + cible
- [ADR-002 : Architecture des Pages](./adr/002-architecture-pages.md) - Arborescence et trames
- [Cahier des charges](./cahier-des-charges.md) - Brief complet
