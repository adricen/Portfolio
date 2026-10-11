# Portfolio Adrien Centonze — Cahier des charges

## Positionnement : Tech Lead / Software Architect – Real-Time 3D Web

---

## 1. Pitch de positionnement

### Accroche principale (à afficher en haut de la home)

> **Architecte 3D temps réel · 15 ans d'expérience**  
> Je conçois des applications web 3D performantes pour l'industrie : configurateurs produits, digital twins, R&amp;D produits innovants. Du profilage SIMD au choix d'architecture applicative, je construis des systèmes temps réel qui tiennent leurs budgets de performance — et les équipes qui les font vivre.

### Variantes courtes (selon support)

- **LinkedIn headline** : `Software Architect – Real-Time 3D Web | Three.js / Babylon.js / WebGPU | Digital Twin & Configurateurs | 15 ans d'XP`
- **Signature email / bio réseaux** : `Architecte 3D web — systèmes temps réels performants pour l'industrie. Créatif-ingénieur du hardware au pixel.`
- **Réponse à "présentez-vous en 30s"** : *"15 ans de 3D temps réel, des jeux vidéo au web industriel. Aujourd'hui j'architecte des applications 3D web à fort enjeu métier — configurateurs, jumeaux numériques — avec une obsession : la performance mesurée. Ce qui me distingue, c'est la chaîne complète : je comprends le hardware, la fabrication physique, l'art et le code."*

### Les 3 mots-clés à marteler partout

`Architecture applicative` · `Performance temps réel` · `3D à enjeu métier`

---

## 2. Arborescence du site

```
/                    → Home : pitch + 3 projets vedettes + navigation vers études de cas
/projets             → Index des études de cas (filtres : Industrie / Produit / R&D)
/projets/[slug]      → Étude de cas complète (trame en section 4)
/taran-core          → Section dédiée "Architecture & Open Source" (ECS, benchmarks)
/ia                  → RAG local + projets 3D×IA (WebGPU inference, LLM-RAG)
/a-propos            → Parcours 15 ans, timeline, leadership, témoignages
/contact             → Direct : email, LinkedIn, dispo pour un appel de 15 min
/articles            → (optionnel, v2) Blog technique repris de Generative Hut etc.
```

**Principe directeur** : n'importe quelle page doit permettre d'atteindre une étude de cas en **2 clics maximum**.

---

## 3. Spécification page par page

### 3.1 Home (`/`)


| Zone               | Contenu                                                                                   | Objectif                                   |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| Hero               | Accroche + 1 expérience 3D interactive marquante (WebGPU, fallback WebGL2)                | Le "wow moment" unique                     |
| Bandeau de preuve  | 3 chiffres : `15 ans d'XP · 120+ étudiants formés · 4 produits R&D livrés`                | Crédibilité immédiate                      |
| 3 projets vedettes | XSIN-Luxov (ou extrait NDA), Taran Core, LLM-RAG                                          | Montrer l'éventail industrie/ingénierie/IA |
| Ce que je fais     | Architecture 3D web · Optimisation performance · R&amp;D avant-vente · Mentorat technique | Mots-clés ATS + lecture rapide             |
| CTA                | "Voir les études de cas" + "Me contacter"                                                 | Conversion                                 |


⚠️ Le hero doit rester **accessible** : bouton "skip", version statique, chargement &lt; 3s sur mobile. Un architecte performance dont le site rame se disqualifie.

### 3.2 Index projets (`/projets`)

6 entrées maximum, 3 catégories :

- **Industrie &amp; Produit** : extrait configurateur (French Mousse ou Draw Me a Garden anonymisé), XSIN-Luxov si montrable
- **Ingénierie &amp; Open Source** : Taran Core, ATTiny45 GameBoy (faire le pont hardware)
- **IA &amp; R&amp;D** : LLM-RAG local, éventuellement le viewer 3D×IA à venir

Chaque carte : image/preview interactive + 1 ligne de résultat chiffré + tags techno.

### 3.3 Étude de cas (`/projets/[slug]`)

Trame imposée (section 4). Chaque page se termine par un **CTA vers le projet suivant** de la même catégorie.

### 3.4 Taran Core (`/taran-core`)

À traiter comme une **mini-page produit open source** :

- Pitch du problème : "il n'existait pas d'ECS TypeScript satisfaisant pour le temps réel industriel"
- Schéma d'architecture (archetype vs sparse-set, pourquoi l'hybride)
- Tableau de benchmarks vs références (three.js std, bites, miniplex…)
- Readme soigné + lien GitHub + badge CI (tests)
- Un playground live interactif : spawn N entités, observer le framerate

C'est la page qui prouve le niveau "architecte" — elle doit être impeccable.

### 3.5 IA (`/ia`)

- **LLM-RAG local (Ollama)** présenté comme projet d'*architecture IA* : schéma du système, choix d'embeddings, stratégie d'évaluation, coût/latence mesurés
- (V2) Projet 3D×IA dans le navigateur : viewer Gaussian Splatting ou scène three.js pilotée par inférence ONNX/WebGPU
- 1 paragraphe "ce que j'attends de l'IA en production" (gouvernance, évaluation) → montre la maturité lead

### 3.6 À propos (`/a-propos`)

Timeline des 15 ans : jeux vidéo → fabrication/fablabs → web industriel. Insister sur la **cohérence** de la trajectoire (pas une carrière en zigzag, une spécialisation qui s'est approfondie).

- Bloc leadership : 120+ étudiants, management FabLab ULB, mentorat Wanadeov, avant-ventes R&amp;D
- 2-3 faits marquants : Fab Academy (mentoré par le fondateur du Fab Lab MIT), 400+ visières Covid dans 8 pays, Space Run 2M+ ventes
- Témoignages : à demander (1 ancien manager, 1 ancien étudiant/formé, 1 chef de projet client Wanadeov)

### 3.7 Contact (`/contact`)

Direct et désarmant de simplicité : email, LinkedIn, et un créneau d'appel de 15 min. Pas de formulaire interminable.

---

## 4. Trame type d'une étude de cas

Chaque étude suit les 6 blocs ci-dessous (\~600-900 mots + visuels) :

```
1. CONTEXTE          Client/produit (anonymisé si NDA), besoin métier, contraintes
                    (cibles matérielles, délai, équipe)
2. DÉFI TECHNIQUE    Le problème dur en une phrase : "rendre un mur d'escalade
                    configurable à 60fps sur mobile"
3. DÉCISIONS         Les choix d'architecture et POURQUOI. 2-3 décisions maximum,
                    chacune avec l'alternative rejetée et la raison.
4. PERFORMANCE      Chiffres avant/après : fps, chargement, draw calls, bundle.
                    Méthodo de profilage utilisée.
5. RÉSULTAT MÉTIER   Conversion, ventes, adoption, feedback client. Le chiffre
                    qui parle à un manager.
6. CE QUE J'EN RETIRE 1-2 leçons d'architecte (honnêteté > perfection).
```

**Règles** : une étude de cas NDA = version anonymisée + extrait interactif remonté. Les captures d'écran ne suffisent jamais ; priorité à la démo live embarquée.

---

## 5. Fiche projet — données à rassembler par toi


| Projet                     | À collecter                                      | Où le trouver             |
| -------------------------- | ------------------------------------------------ | ------------------------- |
| XSIN-Luxov (escalade)      | Perf mobile, nb de combinaisons, feedback client | Wanadeov / chef de projet |
| Draw Me a Garden           | Perf, usage, résultat commercial                 | Wanadeov                  |
| French Mousse / gobelets   | Conversion, volume de visites                    | Wanadeov                  |
| Taran Core                 | Benchmarks ECS comparés, résultats SIMD          | Tes mesures               |
| LLM-RAG                    | Schéma archi, latence, évaluation de qualité     | Tes mesures               |
| Visière Covid              | 400+ visières, 8 pays, retours utilisateurs      | Archives Love Open Design |
| Framework interne Wanadeov | Adoption interne, nb de projets                  | Wanadeov                  |


→ **Action immédiate : demander l'accord de Wanadeov** pour montrer des extraits (même anonymisés) et récupérer les métriques avant de partir de l'entreprise.

---

## 6. Stack recommandée pour le portfolio lui-même

Le site est ta première étude de cas — il doit pratiquer ce qu'il prêche :

- **Three.js r182+ avec WebGPURenderer + fallback WebGL2** (standard 2026, montre que tu suis le mouvement)
- **Nuxt 4 + TypeScript strict** (montre la rigueur ; tu connais déjà)
- **Performance budget explicite, affiché dans le footer** : ex. "Ce site : 60fps, &lt; 2Mo JS gzippé, 97+ Lighthouse" — clin d'œil d'architecte très efficace en entretien
- Hébergement statique + CI GitHub Actions (déploiement sur push = preuve DevOps)
- Le code du portfolio **open-source sur GitHub** : double preuve (qualité de code + transparence)

---

## 7. Plan de production (6 semaines)


| Semaine | Livrable                                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1       | Rassembler métriques + accords Wanadeov ; écrire le pitch ; maquette arborescence                                          |
| 2       | Setup repo + Vite + CI ; hero interactive (l'expérience "wow")                                                             |
| 3       | Rédaction des 3 études de cas principales (produit)                                                                        |
| 4       | Page Taran Core (benchmarks + playground) + page IA (RAG)                                                                  |
| 5       | À propos + contact ; tests perf (Lighthouse, mobile réel) ; relecture                                                      |
| 6       | Publication ; annonce LinkedIn avec un chiffre fort ("15 ans, nouveau cap : architecte 3D web") ; demander les témoignages |


**Priorité si manque de temps** : home + 3 études de cas + contact. Le reste peut venir en v2.

---

## 8. Critères de réussite (checklist finale)

- [ ] Un recruteur comprend le positionnement "architecte 3D" en &lt; 30 secondes
- [ ] Chaque étude de cas contient au moins 1 chiffre de perf et 1 chiffre métier
- [ ] Le site tient son budget de perf affiché (vérifié sur mobile réel)
- [ ] Le code est public et propre (lint, tests, CI verte)
- [ ] Taran Core a des benchmarks comparatifs visibles
- [ ] La page IA montre évaluation + coût/latence (maturité lead, pas "j'ai bricolé un chatbot")
- [ ] CTA contact atteignable depuis toutes les pages en 1 clic
- [ ] Annonce LinkedIn publiée le jour de la mise en ligne
