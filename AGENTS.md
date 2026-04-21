# AGENTS.md - Configuraciones del Proyecto

## Conceptos Clave

### Importación de axios
- **NO usar**: `import { api } from 'src/boot/axios'` (este archivo solo configura Vue.prototype.$axios)
- **USAR**: `import axios from 'axios'` directamente
- O usar la instancia configurada en `src/piña/services/api.js`

### Quasar en Vue 2
- **NO usar**: `import { useQuasar } from 'quasar'` (es para Vue 3)
- **USAR**: `root.$q` en composition API, o `this.$q` en options API

### Babel compatibility
- Evitar optional chaining (`?.`) y null coalescing (`??`)
- Usar verificaciones tradicionales: `error.response && error.response.data`

### Refs en Vue 2 composition API
- Usar `ref` variables y bindearlas en template con `ref="..."`
- No usar `root.$refs` directamente en setup
