# 🚀 Guide de Démarrage Rapide - Carte de l'Algérie

## ⚡ Démarrage en 5 minutes

### 1. **Vérifier l'environnement**
```bash
# Vérifier Node.js
node --version  # Doit être >= 18

# Vérifier npm
npm --version   # Doit être >= 8

# Vérifier Git
git --version
```

### 2. **Cloner et installer**
```bash
# Cloner le projet
git clone <votre-repo>
cd <votre-projet>

# Installer les dépendances
npm install

# Vérifier que tout fonctionne
npm run dev
```

### 3. **Tester la carte**
```bash
# Exécuter le script de test
./test-algeria-map.sh

# Si tout est OK, vous verrez :
# 🎉 Tous les tests sont passés avec succès !
```

## 🗺️ Structure de la carte

### **Composant principal**
```typescript
// src/components/analytics/AlgeriaChoroplethProfessional.tsx
interface MapMode {
  id: string;           // 'density' | 'recent' | 'sectors'
  label: string;        // Nom affiché
  description: string;  // Description
  colorScale: (value: number, max: number) => string;
}

// 3 modes configurés
const mapModes: MapMode[] = [
  { id: 'density', label: 'Densité des textes', ... },
  { id: 'recent', label: 'Textes récents', ... },
  { id: 'sectors', label: 'Diversité sectorielle', ... }
];
```

### **Géométrie des wilayas**
```typescript
// Fichier GeoJSON : public/algeria-wilayas-simplified.geo.json
// Structure : FeatureCollection avec 58 Features (Polygon)
// Chaque Feature a des propriétés : code, name, shapeISO, etc.
```

### **Base de données**
```sql
-- Table principale
wilayas (id, code, name)

-- Vue des statistiques
v_wilaya_stats (code, name, total_texts, recent_texts, sectors_count, last_publication)

-- Données de démonstration
legal_texts (title, date, wilaya_code, sector, language, status)
```

## 🔧 Développement local

### **Démarrer l'application**
```bash
npm run dev
# Ouvrir http://localhost:5173
# Aller sur l'onglet "Carte Choroplèthe (58 wilayas)"
```

### **Mode développement**
```typescript
// Activer les logs de debug
console.log('Wilayas data:', wilayasData);
console.log('GeoJSON loaded:', wilayasGeojson);
console.log('Current map mode:', mapMode);

// Vérifier les données dans la console du navigateur
```

### **Hot reload**
- Modifiez `AlgeriaChoroplethProfessional.tsx`
- La carte se recharge automatiquement
- Voir les changements en temps réel

## 🧪 Tests et validation

### **Tests automatisés**
```bash
# Exécuter tous les tests
./test-algeria-map.sh

# Tests effectués :
✅ Composant principal créé
✅ Fichier GeoJSON présent et valide
✅ Migrations SQL créées
✅ Section mise à jour
✅ Dépendances installées
✅ Structure du composant correcte
✅ Fonctionnalités clés implémentées
```

### **Tests manuels**
1. **Navigation** : Zoom In/Out, Reset, Pan
2. **Modes** : Changer entre densité, récents, secteurs
3. **Interactions** : Survol, clic sur les wilayas
4. **Responsive** : Redimensionner la fenêtre
5. **Export** : Télécharger le CSV

## 🐛 Debugging

### **Problèmes courants**

#### 1. **Carte ne s'affiche pas**
```bash
# Vérifier le GeoJSON
ls -la public/algeria-wilayas-simplified.geo.json

# Vérifier la console du navigateur
# Erreurs 404, 500, etc.
```

#### 2. **Pas de données**
```sql
-- Vérifier les wilayas
SELECT COUNT(*) FROM wilayas WHERE code ~ '^[0-9]{2}$';

-- Vérifier la vue
SELECT * FROM v_wilaya_stats LIMIT 5;

-- Vérifier les textes de démonstration
SELECT COUNT(*) FROM legal_texts WHERE title LIKE '%DEMO%';
```

#### 3. **Erreurs TypeScript**
```bash
# Vérifier la compilation
npm run build

# Vérifier les types
npx tsc --noEmit
```

### **Logs de debug**
```typescript
// Dans le composant
useEffect(() => {
  console.log('🔍 Debug - Wilayas data:', wilayasData);
  console.log('🔍 Debug - GeoJSON:', wilayasGeojson);
  console.log('🔍 Debug - Map mode:', mapMode);
}, [wilayasData, wilayasGeojson, mapMode]);
```

## 🎨 Personnalisation

### **Modifier les couleurs**
```typescript
// Dans AlgeriaChoroplethProfessional.tsx
const mapModes: MapMode[] = [
  {
    id: 'density',
    colorScale: (value: number, max: number) => {
      if (value === 0) return 'hsl(var(--muted))';
      const ratio = Math.min(1, value / max);
      
      // Personnaliser ici
      if (ratio < 0.2) return 'hsl(200, 70%, 90%)';
      if (ratio < 0.4) return 'hsl(200, 70%, 75%)';
      if (ratio < 0.6) return 'hsl(200, 70%, 60%)';
      if (ratio < 0.8) return 'hsl(200, 70%, 45%)';
      return 'hsl(200, 70%, 30%)';
    }
  }
];
```

### **Ajouter un nouveau mode**
```typescript
// Ajouter dans le tableau mapModes
{
  id: 'custom',
  label: 'Mode personnalisé',
  description: 'Description du nouveau mode',
  colorScale: (value: number, max: number) => {
    // Logique de couleurs
    return `hsl(${120 + (value / max) * 60}, 70%, 50%)`;
  }
}
```

### **Modifier l'aspect ratio**
```typescript
// Changer l'aspect ratio du conteneur
<div className="relative w-full aspect-[16/9] min-h-[600px]">
  {/* Carte avec aspect ratio 16:9 */}
</div>

// Options disponibles :
// aspect-[4/5]   - Vertical (actuel)
// aspect-[16/9]  - Large
// aspect-square  - Carré
// aspect-video   - Vidéo
```

## 📊 Données et API

### **Structure des données**
```typescript
interface WilayaStats {
  code: string;           // '01', '02', ..., '58'
  name: string;           // 'Adrar', 'Chlef', etc.
  ar_name?: string;       // Nom en arabe (optionnel)
  total_texts: number;    // Nombre total de textes
  recent_texts: number;   // Textes des 30 derniers jours
  sectors_count: number;  // Nombre de secteurs différents
  last_publication?: string; // Date de dernière publication
}
```

### **API Supabase**
```typescript
// Charger les statistiques
const { data, error } = await supabase
  .from('v_wilaya_stats')
  .select('*')
  .order('code');

// Insérer des wilayas
const { error } = await supabase
  .from('wilayas')
  .insert([
    { code: '01', name: 'Adrar' },
    { code: '02', name: 'Chlef' }
  ]);
```

### **Gestion d'erreurs**
```typescript
if (error) {
  console.error('Erreur Supabase:', error);
  toast({
    title: 'Erreur de chargement',
    description: 'Impossible de charger les données.',
    variant: 'destructive'
  });
  
  // Fallback avec données de démonstration
  setWilayasData(demoData);
}
```

## 🚀 Déploiement

### **Préparer la production**
```bash
# Build de production
npm run build

# Vérifier le build
npm run preview

# Tester localement
npm run preview
# Ouvrir http://localhost:4173
```

### **Variables d'environnement**
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Vérifications pré-déploiement**
- [ ] Tests passent : `./test-algeria-map.sh`
- [ ] Build réussit : `npm run build`
- [ ] Preview fonctionne : `npm run preview`
- [ ] Migrations SQL exécutées
- [ ] Variables d'environnement configurées

## 📚 Ressources utiles

### **Documentation**
- [React Simple Maps](https://www.react-simple-maps.io/)
- [D3.js](https://d3js.org/)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### **Composants UI**
- [Shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### **Outils de développement**
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Supabase Studio](https://supabase.com/dashboard)
- [Postman](https://www.postman.com/) pour tester les API

## 🆘 Support et aide

### **En cas de problème**
1. **Vérifier la console** du navigateur
2. **Consulter les logs** de l'application
3. **Exécuter les tests** : `./test-algeria-map.sh`
4. **Vérifier la base** de données Supabase
5. **Créer une issue** avec les détails

### **Contact**
- **Issues GitHub** : [Créer une issue](../../issues)
- **Documentation** : Voir `ALGERIA_MAP_REFONTE_README.md`
- **Tests** : Exécuter `./test-algeria-map.sh`

---

## 🎯 Prochaines étapes

1. **Tester la carte** localement
2. **Exécuter les migrations** SQL
3. **Personnaliser** selon vos besoins
4. **Déployer** en production
5. **Former les utilisateurs**

**Bonne chance avec votre carte de l'Algérie ! 🗺️✨**