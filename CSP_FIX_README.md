# 🔧 Correction des Problèmes CSP avec Tesseract.js

## 📋 Problème Identifié

L'application rencontrait des erreurs de Content Security Policy (CSP) lors de l'utilisation de Tesseract.js :

```
Refused to load the script 'https://cdn.jsdelivr.net/npm/tesseract.js@v6.0.1/dist/worker.min.js' 
because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
```

## 🎯 Solutions Implémentées

### 1. **Téléchargement des Fichiers Tesseract.js Locaux**

Les fichiers suivants ont été téléchargés dans le dossier `public/` :
- `tesseract-worker.js` - Worker principal de Tesseract.js
- `tesseract-core.wasm.js` - Core WASM de Tesseract.js  
- `tesseract-core.wasm` - Fichier WASM binaire
- `tesseract-lang/` - Dossier contenant les langues français et arabe

### 2. **Modification de la Politique CSP**

#### Fichier `server.js`
- Ajout des domaines `cdn.jsdelivr.net` et `unpkg.com` aux directives `scriptSrc` et `connectSrc`
- Ajout des directives `workerSrc` et `childSrc` pour autoriser les Web Workers
- Configuration conditionnelle de Helmet selon l'environnement

#### Variables d'environnement
- Création du fichier `.env` avec `DISABLE_CSP=true` pour le développement
- Configuration des chemins Tesseract.js

### 3. **Mise à Jour des Services OCR**

Tous les services utilisant Tesseract.js ont été mis à jour pour utiliser les fichiers locaux :

- `src/services/ocrService.ts`
- `src/services/realOcrService.ts` 
- `src/services/optimizedOCRService.ts`
- `src/services/advancedOCRService.ts`
- `src/services/enhanced/contentExtractionService.ts`
- `src/services/enhanced/realOCRExtractionService.ts`

### 4. **Configuration Unifiée Tesseract.js**

#### Fichier `src/config/tesseract.ts`
- Configuration centralisée pour Tesseract.js
- Gestion automatique des chemins selon l'environnement
- Vérification de la disponibilité des fichiers locaux

#### Service Unifié `src/services/unifiedOCRService.ts`
- Service OCR centralisé avec gestion des erreurs CSP
- Fallback automatique vers CDN si les fichiers locaux ne sont pas disponibles
- Gestion robuste des erreurs et réinitialisation automatique

### 5. **Composant de Test**

#### `src/components/OCRTestComponent.tsx`
- Interface de test pour vérifier le fonctionnement de l'OCR
- Tests d'initialisation, d'extraction et de vérification des fichiers
- Affichage des erreurs et du statut du service

## 🚀 Utilisation

### Démarrage en Mode Développement

```bash
# Démarrer le serveur avec CSP désactivée
npm run dev

# Ou utiliser le script de démarrage
./start-lyo-dev.sh
```

### Test de l'OCR

1. Accéder au composant de test OCR
2. Cliquer sur "Tester l'initialisation"
3. Vérifier les fichiers avec "Vérifier les fichiers"
4. Tester l'OCR sur une image

## 🔍 Vérification

### Fichiers Requis

Vérifiez que les fichiers suivants sont présents dans `public/` :

```
public/
├── tesseract-worker.js          # ✅ Worker Tesseract.js
├── tesseract-core.wasm.js       # ✅ Core WASM JS
├── tesseract-core.wasm          # ✅ Core WASM binaire
└── tesseract-lang/
    ├── fra.traineddata          # ✅ Langue française
    └── ara.traineddata          # ✅ Langue arabe
```

### Test de Fonctionnement

1. **Initialisation** : Le service OCR doit s'initialiser sans erreur CSP
2. **Extraction** : L'OCR doit fonctionner sur des images
3. **Langues** : Support du français et de l'arabe
4. **Performance** : Pas de chargement depuis des CDN externes

## 🛡️ Sécurité

### Mode Développement
- CSP désactivée pour faciliter le développement
- Fichiers Tesseract.js servis localement

### Mode Production
- CSP activée avec directives appropriées
- Fallback vers CDN si nécessaire
- Validation des sources externes

## 🔄 Maintenance

### Mise à Jour de Tesseract.js

```bash
# Télécharger les nouvelles versions
cd public
curl -o tesseract-worker.js https://cdn.jsdelivr.net/npm/tesseract.js@latest/dist/worker.min.js
curl -o tesseract-core.wasm.js https://cdn.jsdelivr.net/npm/tesseract.js-core@latest/tesseract-core.wasm.js
curl -o tesseract-core.wasm https://cdn.jsdelivr.net/npm/tesseract.js-core@latest/tesseract-core.wasm
```

### Vérification des Langues

```bash
# Vérifier que les fichiers de langue sont à jour
ls -la public/tesseract-lang/
```

## 📝 Notes Techniques

### Gestion des Erreurs CSP
- Détection automatique des erreurs `importScripts`
- Réinitialisation automatique du service
- Fallback vers configuration alternative

### Performance
- Chargement local des fichiers (pas de latence réseau)
- Cache des workers Tesseract.js
- Gestion de la mémoire avec `terminate()`

### Compatibilité
- Support des navigateurs modernes avec Web Workers
- Fallback pour les environnements restrictifs
- Configuration adaptative selon l'environnement

## ✅ Résultat Attendu

Après ces corrections, l'application doit :
- ✅ S'initialiser sans erreurs CSP
- ✅ Fonctionner avec Tesseract.js en local
- ✅ Supporter l'OCR français et arabe
- ✅ Être plus performante (pas de CDN)
- ✅ Être plus sécurisée (fichiers locaux)

## 🆘 Dépannage

### Erreurs Persistantes
1. Vérifier que tous les fichiers sont présents dans `public/`
2. Redémarrer le serveur après les modifications
3. Vider le cache du navigateur
4. Vérifier les logs du serveur

### Problèmes de Performance
1. Vérifier la taille des fichiers de langue
2. Optimiser la configuration des workers
3. Implémenter un cache des résultats OCR

---

**Développé pour Dalil.dz - Plateforme Algérienne de Veille Juridique** 🇩🇿