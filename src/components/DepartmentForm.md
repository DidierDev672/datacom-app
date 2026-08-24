# `DepartmentForm`

Formulario Quasar para **crear o editar** un departamento y sus **áreas de trabajo**. Persiste mediante el store Pinia `useDepartmentStore` (`src/stores/department.store.js`), que a su vez usa `department.api.js`.

**Ubicación del componente:** `src/components/DepartmentForm.vue`  
*(Existe otro archivo en `src/components/departments/DepartmentForm.vue`; las vistas públicas importan el de `src/components/`.)*

---

## Requisitos

- **Vue 2** + **Quasar** (`q-form`, `q-input`, `q-select`, `q-card`, etc.).
- **Pinia:** el componente usa `useDepartmentStore()` para `create`, `update`, `isLoading` y `errors`.
- **Vue Router:** tras una edición exitosa redirige a `'/departments'`.

---

## Props

| Prop            | Tipo      | Por defecto | Descripción |
|-----------------|-----------|-------------|-------------|
| `initialData`   | `Object`  | `null`      | Datos iniciales del departamento (y opcionalmente `areas`). Si es `null`, el formulario arranca vacío (modo alta). |
| `isEditing`     | `Boolean` | `false`     | Si es `true` y existe `initialData.id`, al guardar se llama `store.update(id, form)`; si no, `store.create(form)`. |

### Forma esperada de `initialData`

Campos que el formulario lee (los que faltan se rellenan con valores por defecto):

- `id` — necesario en modo edición para el `update`.
- `name`, `code`, `description`, `status` — departamento (`status` típico: `'ACTIVO'` | `'INACTIVO'`).
- `areas` — array opcional de objetos con al menos: `name`, `manager`, `description`, `status` (misma convención de estado).

`initialData` se observa con `watch` profundo; si cambia, el formulario se sincroniza de nuevo.

---

## Ejemplo: cómo llenar el formulario

### En la interfaz (alta manual)

Sigue el orden del propio formulario, de arriba a abajo.

**1. Información del departamento**

| Campo | Qué poner | Notas |
|-------|-----------|--------|
| **Nombre del departamento** | Por ejemplo: `Compras y Abastecimiento` | Obligatorio, mínimo **3** caracteres. |
| **Código** | Por ejemplo: `ABAST2025` o `COMPRAS` | Hasta **10** caracteres; al salir del campo se pasan a mayúsculas. Si el backend exige unicidad y ya existe, verás error en código. |
| **Estado** | `Activo` o `Inactivo` | Obligatorio (valores internos `ACTIVO` / `INACTIVO`). |
| **Descripción** | Texto libre, máx. 255 caracteres | Opcional. |

**2. Áreas de trabajo (opcional)**

- Pulsa **«Agregar área»** tantas veces como áreas necesites.
- Por cada área rellena al menos **Nombre del área** (obligatorio, mínimo 3 caracteres) y **Estado**.
- **Responsable** y **Descripción del área** son opcionales; la descripción admite hasta 255 caracteres.
- Puedes **eliminar** un bloque de área con el icono de papelera.

**3. Enviar**

- **Guardar Departamento** envía el departamento y las áreas al backend (vía store).
- **Cancelar** solo limpia el formulario localmente; no te saca de la página (usa el botón atrás de la vista si aplica).

### Ejemplo de datos (equivalente en JSON)

Objeto que coincide con lo que el componente envía en `form` (útil para pruebas o para construir `initialData` en edición):

```json
{
  "name": "Compras y Abastecimiento",
  "code": "COMPRABAST",
  "description": "Gestión de proveedores, órdenes de compra y abastecimiento general.",
  "status": "ACTIVO",
  "areas": [
    {
      "name": "Negociación con proveedores",
      "manager": "María López",
      "description": "Cotizaciones y contratos.",
      "status": "ACTIVO"
    },
    {
      "name": "Logística interna",
      "manager": "Carlos Ruiz",
      "description": "",
      "status": "ACTIVO"
    }
  ]
}
```

Para **modo edición**, el mismo contenido puede venir en `initialData` junto con el `id` del departamento:

```json
{
  "id": 42,
  "name": "Compras y Abastecimiento",
  "code": "COMPRABAST",
  "description": "Gestión de proveedores, órdenes de compra y abastecimiento general.",
  "status": "ACTIVO",
  "areas": [
    {
      "name": "Negociación con proveedores",
      "manager": "María López",
      "description": "Cotizaciones y contratos.",
      "status": "ACTIVO"
    }
  ]
}
```

También puedes guardar solo el departamento **sin** áreas: deja la lista vacía y no pulses «Agregar área».

---

## Comportamiento

### Creación (`isEditing: false`, sin `initialData` o vacío)

1. Validación en cliente (nombre requerido, mínimo 3 caracteres; estado requerido; por área: nombre requerido y mínimo 3 caracteres).
2. **Guardar:** `departmentStore.create(form)`.
3. Si el servidor responde error **400**, los mensajes por campo pueden mapearse en `store.errors` y mostrarse en los inputs.
4. Si es **409**, el store puede poner `errors.code` (código duplicado).
5. Éxito: notificación positiva, **reseteo del formulario**.

### Edición (`isEditing: true`, `initialData` con `id`)

1. Misma validación.
2. **Guardar:** `departmentStore.update(initialData.id, form)`.
3. Éxito: notificación positiva, reset, **navegación a** `'/departments'`.

### Cancelar

Llama `resetForm()` (limpia campos y `store.errors`). **No** navega hacia atrás por sí solo; la vista padre puede envolver la página con su propio botón “atrás” si hace falta.

### Carga asíncrona (recomendado en edición)

En la vista de edición se debe **esperar** a tener el departamento (por ejemplo con `fetchById` en `onMounted`) y solo entonces montar `DepartmentForm` con `:initial-data` y `:is-editing="true"`, como en `DepartmentEditView.vue`.

---

## Uso en vistas

### Alta — solo importar y montar

```vue
<template>
  <DepartmentForm />
</template>

<script>
import DepartmentForm from '../components/DepartmentForm.vue'

export default {
  components: { DepartmentForm }
}
</script>
```

Referencia: `src/views/DepartmentCreateView.vue`.

### Edición — datos desde el store

```vue
<template>
  <DepartmentForm
    v-if="departmentStore.currentDepartment"
    :initial-data="departmentStore.currentDepartment"
    :is-editing="true"
  />
</template>

<script>
import DepartmentForm from '../components/DepartmentForm.vue'
import { useDepartmentStore } from '../stores/department.store'

export default {
  components: { DepartmentForm },
  setup(props, { root }) {
    const departmentStore = useDepartmentStore()
    // En onMounted: await departmentStore.fetchById(idDesdeRuta)
    return { departmentStore }
  }
}
</script>
```

Referencia: `src/views/DepartmentEditView.vue`.

---

## Notas de UI

- El encabezado del bloque principal muestra el texto **«Crear Departamento»**; si necesitas distinguir alta/edición en título, habría que parametrizar el componente o usar una envoltura en la vista.
- Las **áreas** son opcionales: se puede guardar un departamento sin añadir ninguna.
- Vista responsive: en pantallas `< md` cada área se muestra en tarjeta; en desktop, en fila con botón eliminar.

---

## Errores del servidor

Los errores de validación del backend se reflejan en `this.store.errors` (objeto por campo). El formulario enlaza `:error` / `:error-message` para departamento (`name`, `code`, `status`, `description`).

---

## Dependencias internas

| Módulo | Uso |
|--------|-----|
| `../stores/department.store` | Pinia: `create`, `update`, `errors`, `isLoading` |
| API HTTP | Indirecta vía `departmentApi` en el store |
