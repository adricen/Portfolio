---
title: "Project Management"
description: "Une page pour la mise en place de ce site"
---

# Project Management

> Cet article est temporaire et existe dans le but de me permettre d'avancer dans la création de la mise en place de ce site

## Version 0.1

Idée global:
* style art déco
* concept Ingénieur éclairé (cf Schuiten, Jules vernes)

architecture v1:
Hero Header bandeau dans le style de [contour art deco](https://www.figma.com/file/0g1Z7k6r5J8Q9X3lW2v1zG/Portfolio?type=design&node-id=0%3A1&mode=design&t=4jYtq6n5y7x8Ff4E-1)

avec Nom prenom citation: "L’ingénierie comme art, la technologie comme toile."

### Project management waterfall:

#### Architecture technique

* infra global:
    - [x] Mise en place infra Vercel
    - [x] Mise en place infra Nuxt
    - [x] Création du contenu main HTML - pour le moment juste la page about - a retravailler mais pas grave
    - [x] Division en template vue
    - [x] Création du system de publication en articles
    - [ ] setup dev / prod environment (cf nuxt)

* I18n - internationalisatino:
    - [ ] ajout i18n pour la traduction (voir nuxt qui integre ça par defaut à prioris) - cf nuxt > component > [i18n](https://ui.nuxt.com/docs/components/locale-select)
    - [ ] traduction des articles si necessaire (plus tard ?)

* Navigation :
    - [x] nav - cf nuxt > component > [nav]()
    - [ ] file d'ariane - cf nuxt > component > [breadcrumb](https://ui.nuxt.com/docs/components/breadcrumb)
    - [ ] navigation dans un article: cf nuxt > component > [article content nav](https://ui.nuxt.com/docs/components/content-toc)
    - [ ] research bar - cf nuxt > component > [search bar](https://ui.nuxt.com/docs/components/content-search) + content search button

* contact form:
    - [ ] integration technique du formulaire de contact (cf ce que propose nuxt là dessus) - cf nuxt component > contact forms elements

* enluminures:
    - [ ] color mode switcher - cf nuxt > component > [color mode switcher](https://ui.nuxt.com/docs/components/color-mode-button)
    - [ ] animation blending de couleurs basique entre page pour check le system

#### Design 3D

- [ ] faire un premier jet sur photoshop pour voir si le style est bon
- [ ] création fauteuil 3D de base pour paintover et intégration dans le design 2D
- [ ] travailler la mise en forme globale du site avec le fauteuil 3D intégré dans le design 2D

#### integration 3D

- [ ] création threejs pluggin
- [ ] Création canvas threejs
- [ ] intégrer couche webgpu


### Possible element interessants à intégrer et travailler

- [ ] particules de poussiere
- [ ] fumée volumétrique
- [ ] effets de lumière volumétrique (cf particules)
- [ ] camera 3D avec mouvement de caméra et profondeur de champ et basé sur accelerometre du téléphone pour le mouvement de la camera