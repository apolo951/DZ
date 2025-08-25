// Utility to activate LOCAL_ONLY mode and prevent external connections
export function activateLocalOnlyMode() {
  try {
    localStorage.setItem('LOCAL_ONLY', 'true');
    console.log('🔒 Mode LOCAL_ONLY activé');
    console.log('✅ Aucune connexion externe ne sera établie');
    console.log('🇩🇿 Application 100% locale opérationnelle');
    
    // Reload the page to apply the new setting
    window.location.reload();
  } catch (error) {
    console.warn('Impossible d\'activer le mode LOCAL_ONLY:', error);
  }
}

// Check if LOCAL_ONLY mode is active
export function isLocalOnlyActive(): boolean {
  try {
    return localStorage.getItem('LOCAL_ONLY') === 'true';
  } catch {
    return false;
  }
}

// Auto-activate LOCAL_ONLY mode on first load if not set
if (typeof window !== 'undefined' && !localStorage.getItem('LOCAL_ONLY')) {
  activateLocalOnlyMode();
}