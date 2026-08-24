import { createPinia } from 'pinia';

/**
 * Instancia única de Pinia para boot, router y componentes.
 * Evita dos stores distintos (auth en UI ≠ auth en beforeEach).
 */
export const pinia = createPinia();
