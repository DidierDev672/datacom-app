import { defineStore } from 'pinia'
import client from 'src/api/client'
import { normalize } from 'src/utils/stringUtils'
import { SOLICITUDES_ROUTES } from 'src/constants/solicitudesRoutes'

export const useAbastecimientoPermisosStore = defineStore('abastecimientoPermisos', {
  state: () => ({
    loading: false,
    error: null,
    solicitudesRoutes: [],
    _colaboradorId: null,
  }),

  actions: {
    async loadPermisos(usuarioId, userFullName) {
      this.loading = true
      this.error = null
      this.solicitudesRoutes = []

      try {
        var response = await client.get('/api/v1/colaborador-asignaciones?usuarioId=' + usuarioId)
        var asignaciones = response.data

        if (!Array.isArray(asignaciones)) {
          this.solicitudesRoutes = SOLICITUDES_ROUTES.map(function (r) {
            return { path: r.path, label: r.label, permitted: false }
          })
          return
        }

        var normalizedName = normalize(userFullName)
        var matches = asignaciones.filter(function (a) {
          return normalize(a.colaboradorNombre) === normalizedName
        })

        if (matches.length === 0) {
          this.solicitudesRoutes = SOLICITUDES_ROUTES.map(function (r) {
            return { path: r.path, label: r.label, permitted: false }
          })
          return
        }

        if (matches.length > 1) {
          console.warn('[AbastecimientoLayout] Multiple collaborator matches for user — using first result')
        }

        this._colaboradorId = matches[0].colaboradorId

        var rutasResponse = await client.get('/api/v1/colaborador-rutas/' + this._colaboradorId)
        var rutasData = rutasResponse.data
        var permittedPaths = (rutasData && rutasData.rutas ? rutasData.rutas : []).map(function (r) {
          return r.rutaPath
        })

        this.solicitudesRoutes = SOLICITUDES_ROUTES.map(function (route) {
          return {
            path: route.path,
            label: route.label,
            permitted: permittedPaths.indexOf(route.path) !== -1,
          }
        })
      } catch (e) {
        this.error = 'No se pudieron cargar los permisos de navegación.'
        this.solicitudesRoutes = SOLICITUDES_ROUTES.map(function (r) {
          return { path: r.path, label: r.label, permitted: false }
        })
      } finally {
        this.loading = false
      }
    },
  },
})
