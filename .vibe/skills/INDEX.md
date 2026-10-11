# Index des Skills du Portfolio

## 📌 Structure des Skills
```
.vibe/
└── skills/
    ├── available/              # Skills à charger à la demande (24)
    ├── nuxt-4/                # Chargé au démarrage
    ├── ThreeJs/               # Chargé au démarrage
    └── INDEX.md               # Ce fichier
```

## 📋 Skills Chargés au Démarrage

| Skill | Description | Emplacement |
|-------|-------------|-------------|
| `nuxt4` | Framework Nuxt 4 | `.vibe/skills/nuxt-4/` |
| `threejs` | Librairie 3D Three.js (base) | `.vibe/skills/ThreeJs/` |

## 🌍 Skills Three.js Disponibles à la Demande

> ⚠️ **Ces skills ne sont PAS chargés au démarrage**
> Pour les utiliser : `skill name="nom-du-skill"`

### 🎯 Système & Routage
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-skill-router` | Routeur intelligent pour choisir le bon skill | Toujours pour les tâches Three.js complexes |

### 📹 Caméra & Vue
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-camera-direction` | Caméras avancées, chase rigs, orbite, floating origins | Composition de scène, mouvements de caméra |

### 🎭 Animation
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-animation` | Animations procédurales, cinématique, springs, docking | Objets en mouvement, transitions |

### 🏗️ Géométrie
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-geometry` | Géométries procédurales complexes, extrusion, bevel, fillet | Création d'objets 3D détaillés |
| `threejs-procedural-architecture` | Bâtiments procéduraux, façades, ornements | Architecture, villes procédurales |
| `threejs-parallax-occlusion-mapping` | Parallax Occlusion Mapping, relief | Détails de surface en relief |

### 🌍 Planètes & Environnements
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-planets` | Planètes procédurales, terrain, cratères, biomes | Scènes spatiales, planètes |

### 🎨 Matériaux
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-materials` | Matériaux procéduraux avancés, PBR, textures | Surfaces complexes, matériaux réalistes |
| `threejs-procedural-fields` | Champs scalaires/vectoriels, domain warping | Textures procédurales, masques cohérents |

### 🌿 Végétation
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-vegetation` | Végétation procédurale, arbres, herbe, lianes | Environnements naturels |

### 💧 Eau
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-spectral-ocean` | Océans FFT, vagues, écume, optique aquatique | Scènes maritimes, océans |
| `threejs-water-optics` | Optique de l'eau, caustiques, réfraction | Eau réaliste, piscines, lacs |

### ☁️ Atmosphère
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-atmosphere-aerial-perspective` | Atmosphère planétaire, scattering Rayleigh/Mie | Ciel réaliste, perspective aérienne |
| `threejs-volumetric-clouds` | Nuages volumétriques, ombres de nuages | Ciels nuageux, météo |
| `threejs-precipitation-surfaces` | Précipitations, neige, pluie, accumulation | Effets météo, surfaces mouillées |

### 🌌 VFX & Effets Spéciaux
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-procedural-vfx` | VFX procéduraux, lens flare, feu, fumée, plasma | Effets visuels avancés |
| `threejs-raymarched-space-effects` | Effets spatiaux, trous noirs, distorsion relativiste | Scènes spatiales, effets cosmiques |
| `threejs-temporal-surfaces` | Surfaces temporelles, givre, pluie sur vitre | Effets de surface dynamiques |

### 🎨 Rendu & Post-Processing
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-image-pipeline` | Pipeline de rendu complet, passes multiples | Rendu avancé, effets combinés |
| `threejs-exposure-color-grading` | Exposition HDR, tone mapping, LUT | Gestion de la lumière, couleurs |
| `threejs-bloom` | Effet de bloom HDR | Lumières vives, effets de glow |
| `threejs-screen-space-ambient-occlusion` | GTAO, bent normals, occlusion | Ombre douce, profondeur |
| `threejs-shadow-systems` | Systèmes d'ombres avancés, cascades | Ombres précises à grande échelle |

### ✅ Validation
| Skill | Description | Quand charger |
|-------|-------------|----------------|
| `threejs-visual-validation` | Validation visuelle, tests de régression | Vérification de la qualité visuelle |

---

## 🔗 Comment Utiliser les Skills

### Charger un skill spécifique
```typescript
// Exemple : Charger le skill pour les géométries procédurales
skill({ name: "threejs-procedural-geometry" });
```

### Workflow recommandé
1. **Identifier le besoin** → Consulter cet INDEX.md
2. **Charger le skill** → `skill name="nom-du-skill"`
3. **Utiliser le skill** → Suivre les instructions du skill
4. **Décharger** → Les skills ne restent pas en mémoire après la session

### Exemple complet : Scène planétaire
```typescript
// 1. Charger le routeur pour identifier les besoins
skill({ name: "threejs-skill-router" });

// 2. Charger les skills spécifiques
skill({ name: "threejs-procedural-planets" });      // Planète
skill({ name: "threejs-atmosphere-aerial-perspective" }); // Atmosphère

// 3. Valider le résultat
skill({ name: "threejs-visual-validation" });
```

---

## 📊 Statistiques
- **Skills chargés au démarrage** : 2 (`nuxt4`, `threejs`)
- **Skills disponibles à la demande** : 24
- **Total** : 26 skills Three.js + Nuxt
- **Temps de chargement estimé** : < 1s (au lieu de ~5-10s)
