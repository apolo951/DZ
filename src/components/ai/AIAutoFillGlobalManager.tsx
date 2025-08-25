import React, { useState, useEffect } from 'react';
import { EnhancedAIAutoFillModal } from './EnhancedAIAutoFillModal';

export function AIAutoFillGlobalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<'legal-text' | 'procedure' | 'general'>('general');

  useEffect(() => {
    const handleOpenAIAutoFill = (event: CustomEvent) => {
      console.log('🤖 [AIAutoFillGlobalManager] Événement open-ai-autofill reçu:', event.detail);
      const { context: eventContext } = event.detail || {};
      setContext(eventContext || 'general');
      setIsOpen(true);
    };

    window.addEventListener('open-ai-autofill', handleOpenAIAutoFill as EventListener);
    console.log('✅ [AIAutoFillGlobalManager] Écouteur d\'événements ajouté');

    return () => {
      window.removeEventListener('open-ai-autofill', handleOpenAIAutoFill as EventListener);
      console.log('🔒 [AIAutoFillGlobalManager] Écouteur d\'événements supprimé');
    };
  }, []);

  const handleDataGenerated = (data: Record<string, unknown>) => {
    console.log('📤 [AIAutoFillGlobalManager] Données générées:', data);
    // Dispatch event avec les données générées
    const event = new CustomEvent('ai-data-generated', {
      detail: { data, context }
    });
    window.dispatchEvent(event);
    console.log('✅ [AIAutoFillGlobalManager] Événement ai-data-generated dispatché');
  };

  const handleClose = () => {
    console.log('🔒 [AIAutoFillGlobalManager] Fermeture de la modal');
    setIsOpen(false);
  };

  return (
    <EnhancedAIAutoFillModal
      isOpen={isOpen}
      onClose={handleClose}
      context={context}
      onDataGenerated={handleDataGenerated}
    />
  );
}