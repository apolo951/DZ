import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExtractedDocument } from '@/services/enhanced/algerianDocumentExtractionService';
import { Eye, FileText, Languages, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ExtractionTabProps {
  extractedDocument: ExtractedDocument | null;
  onViewFullText?: () => void;
  onNavigateToPage?: (pageNumber: number) => void;
}

const ExtractionTab: React.FC<ExtractionTabProps> = ({
  extractedDocument,
  onViewFullText,
  onNavigateToPage
}) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  if (!extractedDocument) {
    return (
      <div className="p-6 text-center">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Aucun document extrait. Veuillez d'abord effectuer une extraction.</p>
      </div>
    );
  }

  const { extractedText, metadata, qualityIndicators } = extractedDocument;
  
  const qualityLabel = React.useMemo(() => {
    const score = qualityIndicators.overallScore;
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }, [qualityIndicators]);
  
  // Prévisualisation du texte (500-1000 premiers caractères)
  const previewText = showFullPreview 
    ? extractedText 
    : extractedText.substring(0, 1000);
  
  const isPreviewTruncated = extractedText.length > 1000;

  // Indicateur خالوطة pour documents mixtes
  const isMixedContent = metadata.mixedContent;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec qualité d'extraction */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Texte Extrait</h2>
          <p className="text-muted-foreground">
            {metadata.totalPages} page{metadata.totalPages > 1 ? 's' : ''} • {extractedText.length} caractères
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={qualityLabel === 'excellent' ? 'default' : 
                        qualityLabel === 'good' ? 'secondary' : 'destructive'}>
            {qualityIndicators.overallScore}% Qualité
          </Badge>
          
          {isMixedContent && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              خالوطة (Mixte AR/FR)
            </Badge>
          )}
        </div>
      </div>

      {/* Aperçu du texte */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Aperçu du Texte
            </CardTitle>
            
            <div className="flex gap-2">
              {isPreviewTruncated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullPreview(!showFullPreview)}
                >
                  {showFullPreview ? 'Aperçu court' : 'Voir tout'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onViewFullText}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Naviguer par pages
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-80 w-full rounded border p-4">
            <div className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {previewText}
              {!showFullPreview && isPreviewTruncated && (
                <span className="text-muted-foreground">
                  \n\n... ({extractedText.length - 1000} caractères restants)
                </span>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Métadonnées détectées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métadonnées Détectées</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Type et institution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type de Document</label>
              <p className="font-medium">{metadata.documentType}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Institution</label>
              <p className="font-medium">{metadata.institution || 'Non identifiée'}</p>
            </div>
          </div>

          <Separator />

          {/* Dates et numéros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadata.date && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="font-medium">{metadata.date}</p>
              </div>
            )}
            
            {metadata.number && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Numéro</label>
                <p className="font-medium">{metadata.number}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Langues et caractéristiques */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Langues Détectées
              </label>
              <div className="flex gap-2 mt-1">
                {metadata.detectedLanguages.map(lang => (
                  <Badge key={lang} variant="outline">{lang}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Traité en {metadata.processingTime.toFixed(0)}ms</span>
              </div>
              
              <div className="flex items-center gap-2">
                {metadata.isAlgerianDocument ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Document algérien validé</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-600">Document non-algérien</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Indicateurs de qualité */}
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Indicateurs de Qualité
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {qualityIndicators.ocrConfidence.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">OCR</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {qualityIndicators.entityDetection.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Entités</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {qualityIndicators.structureRecognition.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Structure</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {qualityIndicators.languageConsistency.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Cohérence</div>
              </div>
            </div>
          </div>

          {/* Révision manuelle requise */}
          {metadata.requiresManualReview && (
            <>
              <Separator />
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Révision manuelle recommandée</p>
                  <p className="text-sm text-orange-600">
                    La qualité d'extraction suggère une vérification manuelle avant traitement.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation par pages (si multi-pages) */}
      {metadata.totalPages > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Navigation par Pages</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map(pageNum => (
                <Button
                  key={pageNum}
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToPage?.(pageNum)}
                  className="w-12 h-12"
                >
                  {pageNum}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExtractionTab;