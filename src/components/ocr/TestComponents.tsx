/**
 * Composants de Test Minimaux
 * Pour remplacer temporairement les composants complexes et isoler les erreurs 404
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, FileText, BarChart3, Activity } from "lucide-react";

// Composant de test pour le traitement par lot
export const TestBatchProcessing: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Test - Traitement par Lot
          <Badge variant="outline" className="bg-blue-50">Version Test</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Composant de test pour le traitement par lot
          </p>
          <Button variant="outline" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            Composant de Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de test pour le workflow d'approbation
export const TestApprovalWorkflow: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Test - Workflow d'Approbation
          <Badge variant="outline" className="bg-green-50">Version Test</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Composant de test pour le workflow d'approbation
          </p>
          <Button variant="outline" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            Composant de Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de test pour l'analytics
export const TestOCRAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Test - Analytics OCR
          <Badge variant="outline" className="bg-purple-50">Version Test</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Composant de test pour l'analytics OCR
          </p>
          <Button variant="outline" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            Composant de Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de test pour le diagnostic
export const TestOCRQualityDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" />
          Test - Diagnostic OCR
          <Badge variant="outline" className="bg-red-50">Version Test</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Composant de test pour le diagnostic OCR
          </p>
          <Button variant="outline" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            Composant de Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de test pour le mapping intelligent
export const TestIntelligentMapping: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Test - Mapping Intelligent
          <Badge variant="outline" className="bg-orange-50">Version Test</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Composant de test pour le mapping intelligent
          </p>
          <Button variant="outline" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            Composant de Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};