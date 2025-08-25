import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Languages,
  Calendar,
  Building
} from 'lucide-react';
import { AlgerianExtractionResult } from '@/services/enhanced/algerianDocumentExtractionService';
import { logger } from '@/utils/logger';

interface ExtractionTabProps {
  onExtractionComplete: (extractedDoc: AlgerianExtractionResult) => void;
  extractedDocument: AlgerianExtractionResult | null;
}

export function ExtractionTab({ onExtractionComplete, extractedDocument }: ExtractionTabProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [currentPageView, setCurrentPageView] = useState(0);
  const [showFullText, setShowFullText] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractionProgress(0);

    try {
      logger.info('OCR', 'Début extraction document:', { fileName: file.name });
      
      // Simulation du progrès d'extraction
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await import('@/services/enhanced/algerianDocumentExtractionService')
        .then(mod => mod.default.extractDocument(file));
      
      clearInterval(progressInterval);
      setExtractionProgress(100);
      
      setTimeout(() => {
        onExtractionComplete(result);
        setIsExtracting(false);
      }, 500);

    } catch (error) {
      logger.error('OCR', 'Erreur extraction:', error);
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const getPreviewText = () => {
    if (!extractedDocument) return '';
        return (extractedDocument?.extractedText?.length || 0) > 1000
      ? (extractedDocument?.extractedText?.substring(0, 1000) || '') + '...'
              : (extractedDocument?.extractedText || '');
  };

  const getQualityBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (confidence >= 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Bon</Badge>;
    if (confidence >= 0.5) return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>;
  };

  if (!extractedDocument) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Phase 1: Extraction du Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isExtracting ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-medium">Chargez votre document</h3>
                <p className="text-gray-600">
                  Formats supportés: PDF, Images (JPG, PNG, TIFF)
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="cursor-pointer">
                    Sélectionner un fichier
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Extraction en cours...</h3>
                <Progress value={extractionProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  {extractionProgress < 30 && "Analyse du document..."}
                  {extractionProgress >= 30 && extractionProgress < 60 && "Extraction du texte..."}
                  {extractionProgress >= 60 && extractionProgress < 90 && "Détection des métadonnées..."}
                  {extractionProgress >= 90 && "Finalisation..."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé de l'extraction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Document Extrait avec Succès
            </div>
                            {getQualityBadge(extractedDocument?.metadata?.averageConfidence || 0)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                Pages traitées
              </div>
              <div className="text-2xl font-bold">{extractedDocument?.totalPages || 0}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Languages className="w-4 h-4" />
                Langues détectées
              </div>
              <div className="text-sm">
                {extractedDocument?.languageDetected || 'Non détecté'}
                {extractedDocument?.isMixedLanguage && (
                  <Badge variant="outline" className="ml-1 text-xs">Bilingue</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                Type de document
              </div>
              <div className="text-sm">{extractedDocument?.metadata?.documentType || 'Non détecté'}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Temps traitement
              </div>
              <div className="text-sm">{Math.round(extractedDocument?.metadata?.processingTime || 0)}ms</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Aperçu Texte</TabsTrigger>
          <TabsTrigger value="pages">Navigation Pages</TabsTrigger>
          <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Texte Extrait</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFullText(!showFullText)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showFullText ? 'Aperçu' : 'Voir tout'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {showFullText ? extractedDocument.extractedText : getPreviewText()}
                </pre>
              </div>
              {extractedDocument?.isMixedLanguage && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Languages className="w-4 h-4" />
                    <span className="font-medium">Document Bilingue Détecté</span>
                    <Badge className="bg-blue-100 text-blue-800">Mixte</Badge>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Ce document contient du contenu en arabe et en français
                  </p>
                </div>
              )}
              {!extractedDocument?.isMixedLanguage && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Languages className="w-4 h-4" />
                    <span className="font-medium">Langue Principale Détectée</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {extractedDocument?.languageDetected === 'ar' ? 'العربية' : 'Français'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Navigation par Page
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPageView(Math.max(0, currentPageView - 1))}
                    disabled={currentPageView === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPageView + 1} / {extractedDocument?.totalPages || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                                          onClick={() => setCurrentPageView(Math.min((extractedDocument?.totalPages || 0) - 1, currentPageView + 1))}
                      disabled={currentPageView === (extractedDocument?.totalPages || 0) - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Confiance:</span> {Math.round((extractedDocument?.confidenceScore || 0) * 100)}%
                  </div>
                  <div>
                    <span className="font-medium">Pages extraites:</span> {extractedDocument?.totalPages || 0}
                  </div>
                </div>
                <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {extractedDocument?.extractedText || ''}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées Détectées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Document Officiel</h4>
                    <Badge variant="secondary">
                    Non déterminé
                  </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Langues</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{extractedDocument?.languageDetected || 'Non détecté'}</Badge>
                      {extractedDocument?.isMixedLanguage && (
                        <Badge variant="outline">Bilingue</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Institutions</h4>
                    <div className="space-y-1">
                      {extractedDocument?.metadata?.institutions?.length ? (
                extractedDocument.metadata.institutions.map((inst: string, idx: number) => (
                          <div key={idx} className="text-sm">{inst}</div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Aucune institution détectée</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Qualité d'Extraction</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Global:</span>
                          <span>{Math.round((extractedDocument?.confidenceScore || 0) * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Clarté du texte:</span>
                          <span>{Math.round((extractedDocument?.metadata?.averageConfidence || 0) * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Détection structure:</span>
                          <span>85%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Temps de Traitement</h4>
                      <div className="text-sm">{Math.round(extractedDocument?.metadata?.processingTime || 0)}ms</div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}