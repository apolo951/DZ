/**
 * Interface de test simple pour vérifier le fonctionnement
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SimpleTestInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ Test Interface
            <Badge variant="outline" className="bg-green-50">
              Test
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de test fonctionnelle !</p>
        </CardContent>
      </Card>
    </div>
  );
};