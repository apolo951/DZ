// Re-export from the proper unified modal system
export { ModalProvider, useModal } from './unified/ModalContext';

// Create a proper ModalRenderer that renders all open modals
import React from 'react';
import { useModal } from './unified/ModalContext';
import { UnifiedModalSystem } from './UnifiedModalSystem';
import type { ModalConfig as UnifiedModalConfig } from './unified/types';
import type { ModalConfig as SystemModalConfig } from './UnifiedModalSystem';

// Type adapter to convert between modal config types
const adaptModalConfig = (modal: UnifiedModalConfig): SystemModalConfig => {
  const adaptedSize = modal.size === '2xl' ? 'xl' : modal.size || 'md';
  
  return {
    id: modal.id,
    type: modal.type === 'display' ? 'viewer' : modal.type === 'confirmation' ? 'confirmation' : 'form',
    title: modal.title,
    description: modal.description,
    size: adaptedSize as 'sm' | 'md' | 'lg' | 'xl' | 'full',
    data: 'content' in modal ? modal.content : modal,
    onCancel: modal.onClose,
  };
};

export const ModalRenderer: React.FC = () => {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map((modal) => (
        <UnifiedModalSystem
          key={modal.id}
          modal={adaptModalConfig(modal)}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </>
  );
};