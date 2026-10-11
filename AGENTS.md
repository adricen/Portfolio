# Portfolio Lead Tech — Règles Agent

## 🎯 Périmètre technique
- Framework : Nuxt 4 (Vue 3, TypeScript, SSR/SSG)
- 3D / GPU : Three.js + WebGPU (fallback WebGL2)
- Optimisation : SIMD-ready, code splitting agressif, lazy loading

## 📚 Skills Disponibles
- **Chargés au démarrage** : `nuxt4`, `threejs` (skills de base)
- **Disponibles à la demande** : Voir [INDEX.md](.vibe/skills/INDEX.md) pour la liste complète
- **Emplacement** : `.vibe/skills/available/` (23 skills Three.js spécialisés)

## 🚀 Règles de Chargement des Skills
- **Ne jamais charger tous les skills au démarrage**
- **Utiliser le lazy-loading** : Charger uniquement les skills nécessaires via `skill name="nom-du-skill"`
- **Réference** : Consulter `.vibe/skills/INDEX.md` pour savoir quel skill charger pour quelle tâche

## ⚡ Règles Générales
- Toujours vérifier la doc Nuxt via le MCP avant de générer du code
- Prioriser les patterns SIMD-ready (TypedArrays, DataTransfer) pour les calculs GPU
- Jamais de polyfill WebGPU sans fallback WebGL2 explicite
- Bundle target : < 150 KB initial (sans 3D), < 500 KB avec Three.js
- Toujours utiliser `defineAsyncComponent` pour les composants 3D

## 🔧 Workflow pour les Skills Three.js
1. **Identifier le besoin** : Consulter [INDEX.md](.vibe/skills/INDEX.md)
2. **Charger le skill spécifique** : `skill name="threejs-procedural-geometry"`
3. **Utiliser le skill** : Suivre les instructions du skill chargé
4. **Décharger si nécessaire** : Les skills ne restent pas en mémoire après utilisation

## 💡 Exemples d'Utilisation
```markdown
# Pour une scène avec des bâtiments procéduraux
- Charger : skill name="threejs-procedural-architecture"
- Voir : .vibe/skills/INDEX.md#-architecture

# Pour des effets d'eau réalistes
- Charger : skill name="threejs-water-optics"
- Voir : .vibe/skills/INDEX.md#-eau

# Pour des animations complexes
- Charger : skill name="threejs-procedural-animation"
- Voir : .vibe/skills/INDEX.md#-animation