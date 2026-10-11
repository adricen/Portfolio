#!/bin/bash

# Script de vérification automatique des ADR
# À exécuter dans le cadre du CI/CD ou localement

set -e

echo "🔍 ============================================"
echo "   Vérification des ADR - Portfolio Adrien Centonze"
echo "🔍 ============================================"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur d'erreurs
ERRORS=0

# Fonction pour afficher une erreur
function error() {
  echo -e "${RED}❌ $1${NC}"
  ERRORS=$((ERRORS + 1))
}

# Fonction pour afficher un succès
function success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher un avertissement
function warning() {
  echo -e "${YELLOW}⚠️ $1${NC}"
}

# 1. Vérifier que tous les liens entre ADR sont valides
echo "📚 Vérification des liens entre ADR..."
echo "-------------------------------------------"

# Récupérer tous les fichiers ADR
ADR_FILES=$(find docs/adr -name "[0-9]*-*.md" -type f)

# Pour chaque ADR, vérifier les liens vers d'autres ADR
for file in $ADR_FILES; do
  # Extraire les liens vers d'autres ADR (format ADR-XXX ou ./XXX-*.md)
  LINKS=$(grep -oE "(ADR-[0-9]+|\./[0-9]+-.*\.md|00[0-9]+-.*\.md)" "$file" | grep -v "README.md")
  
  for link in $LINKS; do
    # Nettoyer le lien (enlever ./ ou le chemin relatif)
    CLEAN_LINK=$(echo "$link" | sed 's/\.\///g' | sed 's/ADR-//g')
    
    # Si le lien est un numéro d'ADR (ex: 001)
    if [[ "$CLEAN_LINK" =~ ^[0-9]+$ ]]; then
      ADR_FILE="docs/adr/${CLEAN_LINK}-*.md"
      if ! ls $ADR_FILE 1> /dev/null 2>&1; then
        error "Lien invalide dans $file : ADR-$CLEAN_LINK (fichier non trouvé)"
      else
        success "Lien valide : ADR-$CLEAN_LINK"
      fi
    # Si le lien est un fichier (ex: 001-stack-technique.md)
    elif [[ "$CLEAN_LINK" =~ ^[0-9]+-.*\.md$ ]]; then
      if [ ! -f "docs/adr/$CLEAN_LINK" ]; then
        error "Lien invalide dans $file : $CLEAN_LINK (fichier non trouvé)"
      else
        success "Lien valide : $CLEAN_LINK"
      fi
    fi
  done
done

echo ""

# 2. Vérifier que les décisions de ADR-001 sont implémentées
echo "🛠️  Vérification de l'implémentation des décisions (ADR-001)..."
echo "-------------------------------------------"

# Vérifier que target: 'static' est dans nuxt.config.ts
if [ -f "nuxt.config.ts" ]; then
  if grep -q "target: 'static'" nuxt.config.ts; then
    success "ADR-001 : target: 'static' est implémenté dans nuxt.config.ts"
  else
    warning "ADR-001 : target: 'static' n'est pas encore implémenté dans nuxt.config.ts"
  fi
else
  warning "ADR-001 : nuxt.config.ts non trouvé"
fi

# Vérifier que @nuxt/image est dans package.json
if [ -f "package.json" ]; then
  if grep -q "@nuxt/image" package.json; then
    success "ADR-001 : @nuxt/image est installé"
  else
    warning "ADR-001 : @nuxt/image n'est pas encore installé"
  fi
  
  # Vérifier Three.js
  if grep -q "three" package.json; then
    success "ADR-001 : Three.js est installé"
  else
    warning "ADR-001 : Three.js n'est pas encore installé"
  fi
  
  # Vérifier @three-webgpu/renderer
  if grep -q "@three-webgpu/renderer" package.json; then
    success "ADR-001 : @three-webgpu/renderer est installé"
  else
    warning "ADR-001 : @three-webgpu/renderer n'est pas encore installé"
  fi
  
  # Vérifier @nuxtjs/color-mode
  if grep -q "@nuxtjs/color-mode" package.json; then
    success "ADR-001 : @nuxtjs/color-mode est installé"
  else
    warning "ADR-001 : @nuxtjs/color-mode n'est pas encore installé"
  fi
else
  warning "ADR-001 : package.json non trouvé"
fi

# Vérifier que @nuxtjs/color-mode est activé dans nuxt.config.ts
if [ -f "nuxt.config.ts" ]; then
  if grep -q "@nuxtjs/color-mode" nuxt.config.ts; then
    success "ADR-001 : @nuxtjs/color-mode est activé dans nuxt.config.ts"
  else
    warning "ADR-001 : @nuxtjs/color-mode n'est pas encore activé dans nuxt.config.ts"
  fi
  
  # Vérifier que @nuxt/image est activé dans nuxt.config.ts
  if grep -q "@nuxt/image" nuxt.config.ts; then
    success "ADR-001 : @nuxt/image est activé dans nuxt.config.ts"
  else
    warning "ADR-001 : @nuxt/image n'est pas encore activé dans nuxt.config.ts"
  fi
  
  # Vérifier le code splitting pour Three.js
  if grep -q "manualChunks.*three" nuxt.config.ts; then
    success "ADR-001 : Code splitting pour Three.js est configuré"
  else
    warning "ADR-001 : Code splitting pour Three.js n'est pas encore configuré"
  fi
else
  warning "ADR-001 : nuxt.config.ts non trouvé"
fi

# Vérifier que les collections @nuxt/content sont configurées
if [ -f "content.config.ts" ]; then
  if grep -q "projets" content.config.ts; then
    success "ADR-001/002 : Collection 'projets' est configurée"
  else
    warning "ADR-001/002 : Collection 'projets' n'est pas encore configurée"
  fi
  
  if grep -q "taran-core" content.config.ts; then
    success "ADR-001/002 : Collection 'taran-core' est configurée"
  else
    warning "ADR-001/002 : Collection 'taran-core' n'est pas encore configurée"
  fi
  
  if grep -q "ia" content.config.ts; then
    success "ADR-001/002 : Collection 'ia' est configurée"
  else
    warning "ADR-001/002 : Collection 'ia' n'est pas encore configurée"
  fi
  
  if grep -q "a-propos" content.config.ts; then
    success "ADR-001/002 : Collection 'a-propos' est configurée"
  else
    warning "ADR-001/002 : Collection 'a-propos' n'est pas encore configurée"
  fi
else
  warning "ADR-001/002 : content.config.ts non trouvé"
fi

echo ""

# 3. Vérifier que les pages de ADR-002 existent
if [ -d "pages" ]; then
  echo "📄 Vérification des pages (ADR-002)..."
  echo "-------------------------------------------"
  
  # Pages principales
  PAGES=("index" "projets" "taran-core" "ia" "a-propos" "contact")
  
  for page in "${PAGES[@]}"; do
    if [ -f "pages/${page}.vue" ] || [ -d "pages/${page}" ]; then
      success "ADR-002 : Page /${page} existe"
    else
      warning "ADR-002 : Page /${page} n'existe pas encore"
    fi
  done
  
  # Vérifier la page /projets/[slug]
  if [ -f "pages/projets/[slug].vue" ] || [ -d "pages/projets" ]; then
    success "ADR-002 : Page /projets/[slug] existe"
  else
    warning "ADR-002 : Page /projets/[slug] n'existe pas encore"
  fi
else
  warning "ADR-002 : Dossier pages/ non trouvé"
fi

echo ""

# 4. Vérifier les fichiers de configuration CI/CD
if [ -d ".github/workflows" ]; then
  echo "⚡ Vérification des workflows CI/CD (ADR-001)..."
  echo "-------------------------------------------"
  
  if [ -f ".github/workflows/lighthouse.yml" ]; then
    success "ADR-001 : Workflow Lighthouse CI existe"
  else
    warning "ADR-001 : Workflow Lighthouse CI n'existe pas encore"
  fi
  
  if [ -f ".github/workflows/deploy.yml" ]; then
    success "ADR-001 : Workflow Deploy existe"
  else
    warning "ADR-001 : Workflow Deploy n'existe pas encore"
  fi
  
  if [ -f ".github/workflows/pr-checks.yml" ]; then
    success "ADR-001 : Workflow PR Checks existe"
  else
    warning "ADR-001 : Workflow PR Checks n'existe pas encore"
  fi
else
  warning "ADR-001 : Dossier .github/workflows/ non trouvé"
fi

# Vérifier .lighthouserc.json
if [ -f ".lighthouserc.json" ]; then
  success "ADR-001 : Fichier .lighthouserc.json existe"
else
  warning "ADR-001 : Fichier .lighthouserc.json n'existe pas encore"
fi

echo ""

# 5. Vérifier les composables 3D
if [ -d "composables" ]; then
  echo "🎨 Vérification des composables 3D (ADR-001)..."
  echo "-------------------------------------------"
  
  if [ -f "composables/useThreeRenderer.ts" ]; then
    success "ADR-001 : Composable useThreeRenderer existe"
  else
    warning "ADR-001 : Composable useThreeRenderer n'existe pas encore"
  fi
  
  if [ -f "composables/useGLTFLoader.ts" ]; then
    success "ADR-001 : Composable useGLTFLoader existe"
  else
    warning "ADR-001 : Composable useGLTFLoader n'existe pas encore"
  fi
else
  warning "ADR-001 : Dossier composables/ non trouvé"
fi

echo ""

# 6. Résumé
echo "📊 ============================================"
echo "   Résumé de la vérification"
echo "📊 ============================================"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ Toutes les vérifications ont réussi !${NC}"
  echo ""
  echo "🎉 Les ADR sont cohérents et les décisions sont implémentées."
  exit 0
else
  echo -e "${RED}❌ $ERRORS erreur(s) trouvée(s)${NC}"
  echo ""
  echo "⚠️  Veuillez corriger les problèmes ci-dessus."
  exit 1
fi
