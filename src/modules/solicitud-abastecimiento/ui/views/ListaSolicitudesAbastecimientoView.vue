<template>
  <div class="page-wrapper q-pa-md">
    <q-card class="my-card">

      <!-- ── HEADER SIMPLIFICADO ── -->
      <q-card-section class="header-section row justify-between items-center q-pa-lg">
        <div>
          <div class="text-h5 text-weight-bold text-white">Solicitudes de abastecimiento</div>
          <div class="text-caption text-white opacity-70 q-mt-xs">Gestión y seguimiento de las solicitudes
            de abastecimiento</div>
        </div>
        <div class="header-actions row q-gutter-sm">
          <q-btn unelevated color="white" text-color="primary" icon="playlist_add_check" label="Seleccionar solicitudes"
            no-caps class="btn-select-order" @click="showSelectRequestModal = true" />
          <q-btn unelevated color="white" text-color="primary" icon="add" label="Nueva requesición" class="btn-nueva"
            :to="{ name: 'crear-solicitud-abastecimiento' }" />
        </div>
      </q-card-section>

      <q-card-section v-if="store.error" class="q-px-lg q-pt-md q-pb-none">
        <q-banner dense rounded class="bg-red-1 text-red-9">
          <template v-slot:avatar>
            <q-icon name="error_outline" color="red-8" />
          </template>
          {{ store.error }}
          <template v-slot:action>
            <q-btn flat no-caps color="red-8" label="Reintentar" @click="reloadSolicitudes" />
          </template>
        </q-banner>
      </q-card-section>

      <!-- ── RESUMEN ── -->
      <q-card-section class="summary-section q-px-lg q-pt-md q-pb-none">
        <div class="summary-stat">
          <span class="summary-stat__label">Total solicitudes</span>
          <span class="summary-stat__value">{{ store.solicitudes ? store.solicitudes.length : 0 }}</span>
        </div>
      </q-card-section>

      <!-- ── BARRA DE FILTROS ── -->
      <q-card-section class="q-px-lg q-pt-md q-pb-sm">
        <div class="row q-col-gutter-sm items-center">
          <!-- Búsqueda global -->
          <div class="col-12 col-sm-4">
            <q-input dense outlined bg-color="white" v-model="busqueda" placeholder="Buscar por nombre de orden o ID..."
              clearable>
              <template v-slot:prepend><q-icon name="search" color="grey-5" /></template>
            </q-input>
          </div>
          <!-- Chips de estado -->
          <div class="col-12 col-sm">
            <div class="row q-gutter-sm items-center filter-chips-row" role="tablist" aria-label="Filtrar por estado">
              <button v-for="est in estadosFiltro" :key="est.val" role="tab" :aria-selected="filtroEstado === est.val"
                :aria-label="contarEstado(est.val) === 0 ? `Sin ${est.label}` : undefined" class="filter-btn" :class="[
                  `filter-btn--${est.val.toLowerCase()}`,
                  { 'filter-btn--active': filtroEstado === est.val }
                ]" :style="contarEstado(est.val) === 0 ? 'opacity: 0.5' : ''" @click="setFiltroEstado(est.val)">
                <q-icon :name="est.icon" class="filter-btn__icon" aria-hidden="true" />
                <span class="filter-btn__label">{{ est.label }}</span>
                <span class="filter-btn__badge" :class="{ 'filter-btn__badge--active': filtroEstado === est.val }">
                  {{ contarEstado(est.val) }}
                </span>
              </button>
              <button v-if="filtroEstado" class="filter-btn filter-btn--todos" @click="setFiltroEstado('')">
                <q-icon name="close" class="filter-btn__icon" aria-hidden="true" />
                <span class="filter-btn__label">Todos</span>
              </button>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm items-center q-mt-sm filter-dates-row">
          <!-- Filtros de fecha -->
          <div class="col-12 col-sm-3 col-md-2">
            <q-input dense outlined bg-color="white" v-model="filtroFechaInicio" label="Desde" mask="date" clearable>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtroFechaInicio">
                      <div class="row items-center justify-end"><q-btn v-close-popup label="Cerrar" color="primary"
                          flat /></div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-2">
            <q-input dense outlined bg-color="white" v-model="filtroFechaFin" label="Hasta" mask="date" clearable>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtroFechaFin">
                      <div class="row items-center justify-end"><q-btn v-close-popup label="Cerrar" color="primary"
                          flat /></div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn flat dense color="grey-6" icon="filter_list_off" label="Limpiar" no-caps
              v-if="busqueda || filtroEstado || filtroFechaInicio || filtroFechaFin" @click="limpiarFiltros" />
          </div>
        </div>
      </q-card-section>

      <!-- ── TABLA ESCANEABLE ── -->
      <q-card-section class="q-pa-none">
        <q-table v-if="solicitudesFiltradas && solicitudesFiltradas.length > 0" flat :key="tableResultsKey"
          :data="solicitudesFiltradas" :columns="columns" row-key="id" :loading="store.loading" :class="[
            'solicitudes-table',
            { 'table-animate': !store.loading && solicitudesFiltradas.length > 0 }
          ]" :pagination="{ rowsPerPage: 15 }">
          <!-- Custom Header -->
          <template v-slot:header="props">
            <q-tr :props="props" class="table-header-row">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-th">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Celda Master-Detail: Nombre de la orden + ID -->
          <template v-slot:body-cell-nombreOrden="props">
            <q-td :props="props">
              <div v-if="hasNombreOrden(props.row)" class="text-order-name">
                {{ props.row.nombreOrden.trim() }}
              </div>
              <q-btn v-else flat dense no-caps color="orange-8" icon="edit" label="Asignar nombre"
                class="btn-assign-name" @click="openEditOrderName(props.row)" />
              <div class="text-id-mono q-mt-xs">ID: {{ props.row.id ? props.row.id.split('-')[0] : '' }}</div>
            </q-td>
          </template>

          <!-- Presupuesto -->
          <template v-slot:body-cell-presupuestoDisponible="props">
            <q-td :props="props" class="text-right">
              <span class="text-presupuesto">{{ props.value }}</span>
            </q-td>
          </template>

          <!-- Estado con badge semántico grande -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <div :class="['status-badge', getStatusClass(props.row.estado)]">
                {{ props.row.estado || 'REGISTRADA' }}
              </div>
            </q-td>
          </template>

          <!-- Acción explícita -->
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <div class="row q-gutter-xs justify-center no-wrap">
                <q-btn flat no-caps dense color="primary" icon="visibility" label="Ver" class="action-btn-ver"
                  @click="verDetalle(props.row)" />
                <q-btn flat no-caps dense color="warning" icon="edit" label="Editar" class="action-btn-editar"
                  @click="abrirEditar(props.row)" />
                <q-btn v-if="puedeEliminarSolicitud" flat no-caps dense color="negative" icon="delete" label="Eliminar"
                  class="action-btn-eliminar" @click="confirmarEliminacion(props.row)" />
              </div>
            </q-td>
          </template>
        </q-table>

        <div v-if="!store.loading && (!solicitudesFiltradas || solicitudesFiltradas.length === 0)"
          class="solicitudes-empty-state">
          <div class="solicitudes-empty-icon">
            <q-icon :name="busqueda || filtroEstado ? 'search_off' : 'inbox'" size="40px" color="white" />
          </div>
          <div class="solicitudes-empty-title">
            {{ busqueda || filtroEstado ? "Sin resultados" : "No hay solicitudes registradas" }}
          </div>
          <div class="solicitudes-empty-desc">
            {{ busqueda || filtroEstado
              ? "Ninguna solicitud coincide con los filtros aplicados. Intenta ajustar la búsqueda o el estado."
              : "Crea tu primera solicitud de abastecimiento para comenzar a gestionar las requesiciónes."
            }}
          </div>
          <div class="row q-gutter-sm justify-center q-mt-sm">
            <q-btn v-if="busqueda || filtroEstado" flat no-caps icon="filter_list_off" label="Limpiar filtros"
              color="grey-7" @click="limpiarFiltros" />
            <q-btn v-if="!busqueda && !filtroEstado" unelevated no-caps icon="add" label="Nueva solicitud"
              class="solicitudes-empty-btn" :to="{ name: 'crear-solicitud-abastecimiento' }" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalle (Refactorizado: Task-First) -->
    <q-dialog v-model="modalDetalle" full-height position="right">
      <q-card class="modal-detail-card column no-wrap">
        <!-- ── 1. HEADER ÚTIL (STICKY) ── -->
        <q-card-section class="modal-header-sticky shrink-0">
          <div class="row full-width justify-between items-center no-wrap">
            <div class="header-info">
              <div class="row items-center q-gutter-x-sm">
                <span v-if="hasNombreOrden(selectedSolicitud)" class="text-h6 text-weight-bolder">
                  {{ selectedSolicitud.nombreOrden.trim() }}
                </span>
                <q-btn v-else flat no-caps dense color="orange-8" icon="edit" label="Asignar nombre de orden"
                  class="btn-assign-name-detail" @click="openEditOrderName(selectedSolicitud)" />
                <div :class="['status-badge', getStatusClass(selectedSolicitud ? selectedSolicitud.estado : '')]">
                  {{ selectedSolicitud ? selectedSolicitud.estado : 'REGISTRADA' }}
                </div>
              </div>
              <div class="text-caption text-grey-7 font-medium tracking-wider">
                ID: {{ selectedSolicitud ? selectedSolicitud.id.split('-')[0] : '' }}
              </div>
            </div>

            <div class="header-actions row q-gutter-x-sm no-wrap">
              <q-btn icon="close" flat round dense v-close-popup size="md" class="close-btn-44" />
            </div>
          </div>
        </q-card-section>

        <q-card-section v-if="selectedSolicitud" class="col q-pa-xl scroll modal-body-content">
          <!-- ── 2. SUMMARY CARDS (KPIs FINANCIEROS) ── -->
          <div class="row q-col-gutter-md q-mb-xl">
            <div class="col-12 col-md-4">
              <div class="kpi-card kpi-assigned">
                <div class="kpi-label">Presupuesto Asignado</div>
                <div class="kpi-value">
                  {{ formatMonedaColombiana(selectedSolicitud.presupuestoDisponible) }}
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="kpi-card kpi-executed">
                <div class="kpi-label">Ejecutado (Productos)</div>
                <div class="kpi-value text-blue-9">
                  {{ formatMonedaColombiana(totalProductosServicios) }}
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="kpi-card kpi-available">
                <div class="kpi-label">Saldo Disponible</div>
                <div class="kpi-value text-green-9">
                  {{ formatMonedaColombiana(saldoDisponible) }}
                </div>
              </div>
            </div>

            <!-- Barra de progreso visual -->
            <div class="col-12 q-mt-sm">
              <BudgetProgressBar :value="consumoPorcentaje" label="Consumido" />
            </div>
          </div>

          <div class="row q-col-gutter-xl">
            <!-- ── 3. INFORMACIÓN GENERAL ── -->
            <div class="col-12">
              <NeedInfoCard :need="{
                subdirection: selectedSolicitud.subdireccion,
                description: selectedSolicitud.descripcionNecesidad,
                observations: selectedSolicitud.observacionesProductos
              }" />
            </div>
          </div>

          <!-- ── 5. DATOS DE LA ENTREGA ── -->
          <div class="q-mt-xl">
            <DeliveryDataCard :delivery="{
              department: selectedSolicitud.departamento,
              municipality: selectedSolicitud.municipio,
              address: selectedSolicitud.direccion,
              contact: selectedSolicitud.contacto,
              phone: selectedSolicitud.telefono,
              deliveryDate: selectedSolicitud.fechaEntrega,
              requiresFreight: selectedSolicitud.requiereFlete
            }" />
            <div v-if="selectedSolicitud.garantias" class="q-mt-md">
              <div class="label-style">Garantías</div>
              <div class="value-style text-body2">{{ selectedSolicitud.garantias }}</div>
            </div>
          </div>

          <!-- Desglose de Proyectos vinculados al Abastecimiento -->
          <div class="q-mt-xl">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md row items-center">
              <q-icon name="assignment" color="primary" class="q-mr-sm" /> Proyectos vinculados al abastecimiento
            </div>

            <div v-if="!selectedSolicitud.proyectos || selectedSolicitud.proyectos.length === 0"
              class="bg-grey-1 q-pa-lg rounded-borders border-dashed text-center">
              <q-icon name="info_outline" size="24px" color="grey-5" class="q-mb-sm" />
              <div class="text-body2 text-grey-6">No hay proyectos vinculados a esta solicitud.</div>
            </div>

            <div v-for="(proy, idx) in selectedSolicitud.proyectos" :key="idx" class="q-mb-xl project-card">
              <!-- Encabezado del proyecto -->
              <div class="project-card__header row justify-between items-center">
                <div class="row items-center q-gutter-sm">
                  <q-avatar color="primary" text-color="white" size="36px" font-size="16px">
                    {{ idx + 1 }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-body1 text-grey-9">Proyecto {{ idx + 1 }}</div>
                    <div class="text-caption text-grey-6">
                      <q-icon name="account_tree" size="12px" class="q-mr-xs" />
                      {{ proy.planAbastecimiento || 'Sin plan' }}
                    </div>
                  </div>
                </div>
                <q-chip dense color="blue-1" text-color="blue-9" label="Vinculado" icon="link" />
              </div>

              <!-- Timeline de vinculación -->
              <div class="project-card__body q-pa-lg">
                <div class="link-timeline">
                  <!-- Nodo 1: Presupuesto -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--primary">
                      <q-icon name="savings" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Presupuesto (Plan de Abastecimiento)</div>
                      <div class="link-timeline__value">{{ proy.planAbastecimiento || '—' }}</div>
                    </div>
                  </div>

                  <!-- Línea conectora -->
                  <div class="link-timeline__line"></div>

                  <!-- Nodo 2: Rubro -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--orange">
                      <q-icon name="category" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Rubro asignado</div>
                      <div class="link-timeline__value">{{ proy.item || '—' }}</div>
                    </div>
                  </div>

                  <!-- Línea conectora -->
                  <div class="link-timeline__line"></div>

                  <!-- Nodo 3: Presupuesto Asignado -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--teal">
                      <q-icon name="attach_money" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Presupuesto asignado</div>
                      <div class="link-timeline__value link-timeline__value--highlight">
                        <span class="link-timeline__amount">
                          {{ formatPresupuestoAsignadoProyecto(proy) }}
                        </span>
                        <span v-if="formatPorcentajeProyecto(proy)" class="link-timeline__percentage">
                          {{ formatPorcentajeProyecto(proy) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabla de productos/servicios del proyecto -->
              <div class="project-card__products q-px-md q-pb-md">
                <ProductsTable :items="(proy.productosServicios || []).map(p => ({
                  id: p.id,
                  name: p.descripcion,
                  quantity: p.cantidad,
                  unit: p.unidadMedida,
                  unitPrice: p.valorUnitario
                }))" title="Productos / Servicios" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn v-if="puedeEliminarSolicitud" flat no-caps color="negative" icon="delete" label="Eliminar"
            @click="confirmarEliminacion(selectedSolicitud)" />
          <q-btn v-if="puedeMostrarBotonDevolver" flat no-caps label="Devolver" color="orange"
            @click="confirmarDevolucion(selectedSolicitud)" />
          <q-btn v-if="puedeMostrarBotonAceptarAprobacion" unelevated no-caps label="Aceptar aprobación"
            color="positive" @click="confirmarAprobacion(selectedSolicitud)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CreateOrderNameModal v-model="showEditOrderNameModal" :loading="store.loading" :error="orderNameError"
      :initial-name="editingSolicitud ? (editingSolicitud.nombreOrden || '') : ''"
      dialog-title="Asignar nombre de la orden"
      dialog-subtitle="Ingrese un nombre para identificar esta solicitud en el listado y reportes."
      confirm-label="Guardar nombre" @confirm="onOrderNameSaved" />

    <ApproveSolicitudModal v-model="showApproveModal" @confirm="onApproveConfirm" />

    <q-dialog v-model="showReturnModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-orange text-white row items-center">
          <div class="text-h6 text-white">Devolver solicitud de abastecimiento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <p class="text-subtitle2 q-mb-md">
            Indique el motivo por el cual está devolviendo esta solicitud para corrección.
          </p>
          <q-input v-model="returnNote" type="textarea" label="Nota de devolución" outlined rows="5" autofocus
            placeholder="Escriba aquí los detalles..." :rules="[val => !!val || 'La nota es obligatoria']" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn label="Enviar devolución" color="orange" :loading="store.loading" :disable="!returnNote"
            @click="onReturnConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ── MODAL EDITAR SOLICITUD ── -->
    <q-dialog v-model="modalEditar" persistent position="right">
      <q-card class="modal-edit-card column no-wrap">
        <q-card-section class="modal-header-sticky shrink-0">
          <div class="row full-width justify-between items-center no-wrap">
            <div>
              <div class="text-h6 text-weight-bold">Editar Solicitud</div>
              <div class="text-caption text-grey-7">{{ editForm.nombreOrden || 'Sin nombre' }}</div>
            </div>
            <q-btn icon="close" flat round dense v-close-popup size="md" class="close-btn-44" />
          </div>
        </q-card-section>

        <q-card-section class="col scroll q-pa-xl modal-body-content">
          <div v-if="editError" class="q-mb-md">
            <q-banner dense rounded class="bg-red-1 text-red-9">
              <template v-slot:avatar><q-icon name="error_outline" color="red-8" /></template>
              {{ editError }}
            </q-banner>
          </div>

          <!-- Información general -->
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md row items-center">
            <q-icon name="info" color="primary" class="q-mr-sm" /> Información de Necesidad
          </div>
          <div class="bg-grey-1 q-pa-lg rounded-borders border-dashed q-mb-xl">
            <div class="q-mb-md">
              <AppInput :value="editForm.subdireccion" @input="editForm.subdireccion = $event" label="Subdirección" />
            </div>
            <div>
              <div class="label-style">Descripción de la Necesidad</div>
              <q-input dense outlined bg-color="white" v-model="editForm.descripcionNecesidad" type="textarea"
                rows="3" />
            </div>
          </div>

          <!-- Datos de la entrega -->
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md row items-center">
            <q-icon name="local_shipping" color="primary" class="q-mr-sm" /> Datos de la Entrega
          </div>
          <div class="bg-grey-1 q-pa-lg rounded-borders border-dashed">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="label-style">Área / Departamento</div>
                <q-select v-model="selectedEditArea" :options="areaOptions" option-label="label" option-value="value"
                  emit-value map-options dense outlined bg-color="white" placeholder="Seleccione un departamento"
                  @input="onEditAreaSelected" />
              </div>
              <div class="col-12 col-sm-6">
                <AppInput :value="editForm.departamento" @input="editForm.departamento = $event" label="Departamento" />
              </div>
              <div class="col-12 col-sm-6">
                <AppInput :value="editForm.municipio" @input="editForm.municipio = $event" label="Municipio" />
              </div>
              <div class="col-12">
                <AppInput :value="editForm.direccion" @input="editForm.direccion = $event" label="Dirección" />
              </div>
              <div class="col-12 col-sm-4">
                <AppInput :value="editForm.contacto" @input="editForm.contacto = $event" label="Contacto" />
              </div>
              <div class="col-12 col-sm-4">
                <AppInput :value="editForm.telefono" @input="editForm.telefono = $event" label="Teléfono" type="tel" />
              </div>
              <div class="col-12 col-sm-4">
                <div class="label-style">Fecha de Entrega</div>
                <q-input dense outlined bg-color="white" v-model="editForm.fechaEntrega" mask="date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="editForm.fechaEntrega">
                          <div class="row items-center justify-end"><q-btn v-close-popup label="Cerrar" color="primary"
                              flat /></div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4">
                <div class="label-style">Requiere Flete</div>
                <q-toggle v-model="editForm.requiereFlete" color="primary" />
              </div>
              <div class="col-12">
                <div class="label-style">Garantías</div>
                <q-input dense outlined bg-color="white" v-model="editForm.garantias" type="textarea" rows="2" />
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md row items-center q-mt-xl">
            <q-icon name="comment" color="primary" class="q-mr-sm" /> Observaciones
          </div>
          <div class="bg-grey-1 q-pa-lg rounded-borders border-dashed q-mb-xl">
            <div class="label-style q-mb-xs">Observaciones a la solicitud</div>
            <q-input dense outlined bg-color="white" v-model="editForm.observacionesProductos" type="textarea" rows="4"
              placeholder="Ingrese observaciones, notas o comentarios sobre esta solicitud de abastecimiento..." counter
              maxlength="1000" />
            <div class="text-caption text-grey-5 q-mt-xs">
              Notas internas visibles para el equipo de abastecimiento y aprobación.
            </div>
          </div>

          <!-- Proyectos vinculados al Abastecimiento -->
          <div v-if="editForm.proyectos && editForm.proyectos.length > 0" class="q-mt-xl">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md row items-center">
              <q-icon name="assignment" color="primary" class="q-mr-sm" /> Proyectos vinculados al abastecimiento
            </div>
            <div v-for="(proy, idx) in editForm.proyectos" :key="idx" class="q-mb-xl project-card">
              <div class="project-card__header row justify-between items-center">
                <div class="row items-center q-gutter-sm">
                  <q-avatar color="primary" text-color="white" size="36px" font-size="16px">
                    {{ idx + 1 }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-body1 text-grey-9">Proyecto {{ idx + 1 }}</div>
                    <div class="text-caption text-grey-6">
                      <q-icon name="account_tree" size="12px" class="q-mr-xs" />
                      {{ proy.planAbastecimiento || 'Sin plan' }}
                    </div>
                  </div>
                </div>
                <q-chip dense color="blue-1" text-color="blue-9" label="Vinculado" icon="link" />
              </div>

              <div class="project-card__body q-pa-lg">
                <div class="link-timeline">
                  <!-- Nodo 1: Presupuesto (solo lectura) -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--primary">
                      <q-icon name="savings" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Presupuesto (Plan de Abastecimiento)</div>
                      <div class="link-timeline__value">{{ proy.planAbastecimiento || '—' }}</div>
                    </div>
                  </div>

                  <div class="link-timeline__line"></div>

                  <!-- Nodo 2: Rubro (solo lectura) -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--orange">
                      <q-icon name="category" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Rubro asignado</div>
                      <div class="link-timeline__value">{{ proy.item || '—' }}</div>
                    </div>
                  </div>

                  <div class="link-timeline__line"></div>

                  <!-- Nodo 3: Porcentaje (editable) + Presupuesto asignado (calculado) -->
                  <div class="link-timeline__node">
                    <div class="link-timeline__dot link-timeline__dot--teal">
                      <q-icon name="attach_money" size="16px" color="white" />
                    </div>
                    <div class="link-timeline__content">
                      <div class="link-timeline__label">Porcentaje / Presupuesto asignado</div>
                      <div class="link-timeline__value link-timeline__value--highlight">
                        <div class="row items-center q-gutter-sm no-wrap">
                          <q-input v-model.number="proy.porcentaje" dense outlined bg-color="white" type="number"
                            min="0" max="100" step="0.1" class="porcentaje-input" input-class="text-weight-bold"
                            @update:model-value="onProyectoPorcentajeChange(idx)">
                            <template v-slot:append>
                              <span class="text-caption text-grey-6">%</span>
                            </template>
                          </q-input>
                          <q-icon name="arrow_forward" color="grey-5" size="18px" />
                          <span class="link-timeline__amount">
                            {{ formatPresupuestoAsignadoProyecto(proy, '$0') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabla de productos/servicios (editable) -->
              <div class="project-card__products q-px-md q-pb-md">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-caption text-grey-6 text-weight-bold row items-center">
                    <q-icon name="inventory_2" size="14px" class="q-mr-xs" />
                    Productos / Servicios ({{ proy.productosServicios ? proy.productosServicios.length : 0 }})
                  </div>
                  <q-btn flat dense no-caps color="primary" icon="add" label="Agregar producto" size="sm"
                    @click="agregarProducto(idx)" />
                </div>
                <q-table flat bordered dense :data="proy.productosServicios || []" :columns="productColumns"
                  row-key="id" hide-bottom :pagination="{ rowsPerPage: 0 }">
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="descripcion" :props="props" style="min-width: 200px;">
                        <q-input v-model="props.row.descripcion" dense outlined bg-color="white"
                          placeholder="Descripción del producto" />
                      </q-td>
                      <q-td key="cantidad" :props="props" style="width: 100px;">
                        <q-input v-model.number="props.row.cantidad" dense outlined bg-color="white" type="number"
                          min="0" />
                      </q-td>
                      <q-td key="unidadMedida" :props="props" style="width: 120px;">
                        <q-input v-model="props.row.unidadMedida" dense outlined bg-color="white"
                          placeholder="Unidad" />
                      </q-td>
                      <q-td key="valorUnitario" :props="props" style="width: 130px;">
                        <q-input v-model.number="props.row.valorUnitario" dense outlined bg-color="white" type="number"
                          min="0" prefix="$" />
                      </q-td>
                      <q-td key="acciones" :props="props" style="width: 60px;">
                        <q-btn flat dense round color="negative" icon="delete" size="sm"
                          @click="eliminarProducto(idx, props.rowIndex)" />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar cambios" color="primary" :loading="store.loading" @click="guardarEdicion" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <SupplyPlanRequestsSelectModal v-model="showSelectRequestModal" :requests="store.solicitudes"
      dialog-title="Solicitudes de plan de abastecimiento"
      dialog-subtitle="Seleccione una solicitud registrada para ver su detalle." @selected="onPlanOrderSelected" />

    <!-- ── MODAL RESUMEN EDICIÓN ── -->
    <q-dialog v-model="modalResumenEdicion" persistent>
      <q-card class="modal-resumen-card" style="max-width: 500px; width: 100%;">
        <q-card-section class="bg-positive text-white q-pa-lg">
          <div class="row items-center q-gutter-sm">
            <q-icon name="check_circle" size="28px" />
            <div>
              <div class="text-h6 text-weight-bold">Solicitud actualizada</div>
              <div class="text-caption opacity-80">Resumen de los cambios realizados</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="q-mb-md">
            <div class="label-style">Nombre de la orden</div>
            <div class="value-style">{{ resumenEdicion.nombreOrden || 'Sin nombre' }}</div>
          </div>

          <div v-if="resumenEdicion.subdireccion" class="q-mb-md">
            <div class="label-style">Subdirección</div>
            <div class="value-style">{{ resumenEdicion.subdireccion }}</div>
          </div>

          <div v-if="resumenEdicion.descripcionNecesidad" class="q-mb-md">
            <div class="label-style">Descripción</div>
            <div class="value-style">{{ resumenEdicion.descripcionNecesidad }}</div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center">
            <q-icon name="local_shipping" color="primary" class="q-mr-xs" /> Datos de la Entrega
          </div>

          <div v-if="resumenEdicion.areaNombre" class="q-mb-sm">
            <div class="label-style">Área</div>
            <div class="value-style">{{ resumenEdicion.areaNombre }}</div>
          </div>

          <div class="row q-col-gutter-sm">
            <div v-if="resumenEdicion.departamento" class="col-6">
              <div class="label-style">Departamento</div>
              <div class="value-style">{{ resumenEdicion.departamento }}</div>
            </div>
            <div v-if="resumenEdicion.municipio" class="col-6">
              <div class="label-style">Municipio</div>
              <div class="value-style">{{ resumenEdicion.municipio }}</div>
            </div>
            <div v-if="resumenEdicion.direccion" class="col-12">
              <div class="label-style">Dirección</div>
              <div class="value-style">{{ resumenEdicion.direccion }}</div>
            </div>
            <div v-if="resumenEdicion.contacto" class="col-6">
              <div class="label-style">Contacto</div>
              <div class="value-style">{{ resumenEdicion.contacto }}</div>
            </div>
            <div v-if="resumenEdicion.telefono" class="col-6">
              <div class="label-style">Teléfono</div>
              <div class="value-style">{{ resumenEdicion.telefono }}</div>
            </div>
            <div v-if="resumenEdicion.fechaEntrega" class="col-6">
              <div class="label-style">Fecha de Entrega</div>
              <div class="value-style">{{ resumenEdicion.fechaEntrega }}</div>
            </div>
            <div class="col-6">
              <div class="label-style">Requiere Flete</div>
              <div class="value-style">
                <q-badge :color="resumenEdicion.requiereFlete ? 'green' : 'grey'" text-color="white"
                  style="border-radius: 8px;">
                  {{ resumenEdicion.requiereFlete ? 'Sí' : 'No' }}
                </q-badge>
              </div>
            </div>
          </div>

          <div v-if="resumenEdicion.garantias" class="q-mt-md">
            <div class="label-style">Garantías</div>
            <div class="value-style text-body2">{{ resumenEdicion.garantias }}</div>
          </div>

          <div v-if="resumenEdicion.observacionesProductos" class="q-mt-md">
            <div class="label-style">Observaciones</div>
            <div class="observation-box">{{ resumenEdicion.observacionesProductos }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn unelevated label="Entendido" color="positive" @click="cerrarResumenEdicion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EmptyState from 'src/components/EmptyState.vue';
import { useSolicitudStore } from 'src/modules/solicitud-abastecimiento/ui/store/useSolicitudStore';
import { buildDepartmentSelectOptions } from 'src/modules/talento-humano/ui/utils/departmentSelectOptions';
import { useDepartmentStore } from 'src/stores/department.store';
import AppInput from 'src/utils/components/AppInput.vue';
import { mapGetters } from 'vuex';
import ApproveSolicitudModal from '../components/ApproveSolicitudModal.vue';
import BudgetProgressBar from '../components/BudgetProgressBar.vue';
import CreateOrderNameModal from '../components/CreateOrderNameModal.vue';
import DeliveryDataCard from '../components/DeliveryDataCard.vue';
import NeedInfoCard from '../components/NeedInfoCard.vue';
import ProductsTable from '../components/ProductsTable.vue';
import SupplyPlanRequestsSelectModal from '../components/SupplyPlanRequestsSelectModal.vue';
import {
  evaluateSupplyRequestApprovalPermission,
  resolveUsernameFromSession,
  SUPPLY_REQUEST_APPROVAL_DENIED_MESSAGE,
  SUPPLY_REQUEST_DELETE_DENIED_MESSAGE,
} from '../utils/approvalPermission';

export default {
  name: 'ListaSolicitudesAbastecimientoView',
  components: {
    ApproveSolicitudModal,
    CreateOrderNameModal,
    SupplyPlanRequestsSelectModal,
    AppInput,
    ProductsTable,
    DeliveryDataCard,
    NeedInfoCard,
    BudgetProgressBar,
    EmptyState,
  },
  data() {
    return {
      store: useSolicitudStore(),
      departmentStore: useDepartmentStore(),
      areaOptions: [],
      selectedEditArea: null,
      busqueda: '',
      filtroEstado: '',
      estadosFiltro: [
        { val: 'PENDIENTE', label: 'Pendientes', color: 'orange', icon: 'schedule' },
        { val: 'ACEPTADO', label: 'Aceptadas', color: 'green', icon: 'check_circle' },
        { val: 'DEVUELTO', label: 'Devueltas', color: 'red', icon: 'replay' }
      ],
      selectedSolicitud: null,
      editingSolicitud: null,
      modalDetalle: false,
      showEditOrderNameModal: false,
      showSelectRequestModal: false,
      modalEditar: false,
      editForm: {},
      editError: '',
      modalResumenEdicion: false,
      resumenEdicion: {},
      orderNameError: '',
      filtroFechaInicio: '',
      filtroFechaFin: '',
      usuarioPuedeAceptarAprobacion: false,
      usuarioPuedeEliminarSolicitud: false,
      permisoAprobacionResuelto: false,
      aprobadorNombreSesion: '',
      showApproveModal: false,
      showReturnModal: false,
      returnNote: '',
    };
  },
  computed: {
    ...mapGetters('auth', {
      usuarioSesion: 'getUser',
    }),
    puedeMostrarBotonAceptarAprobacion() {
      if (!this.selectedSolicitud) {
        return false;
      }
      const estado = (this.selectedSolicitud.estado || '').toUpperCase();
      return estado !== 'ACEPTADO' && estado !== 'APROBADO';
    },
    puedeMostrarBotonDevolver() {
      if (!this.selectedSolicitud) {
        return false;
      }
      const estado = (this.selectedSolicitud.estado || '').toUpperCase();
      return estado !== 'DEVUELTO' && estado !== 'ACEPTADO' && estado !== 'APROBADO';
    },
    puedeEliminarSolicitud() {
      return this.permisoAprobacionResuelto && this.usuarioPuedeEliminarSolicitud;
    },
    columns() {
      var formatMoneda = this.formatMonedaColombiana;
      return [
        {
          name: 'nombreOrden',
          label: 'Nombre de la orden',
          field: function (row) {
            return (row.nombreOrden && row.nombreOrden.trim()) || '';
          },
          align: 'left',
          sortable: true,
        },
        {
          name: 'presupuestoDisponible',
          label: 'Presupuesto',
          field: 'presupuestoDisponible',
          align: 'right',
          sortable: true,
          format: function (val) {
            return formatMoneda(val);
          },
        },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
        { name: 'acciones', label: 'Acción', field: 'id', align: 'center' },
      ];
    },
    formatMonedaColombiana() {
      return function (valor, emptyValue) {
        var numero = Number(valor);
        if (valor === null || valor === undefined || valor === '' || isNaN(numero)) {
          return emptyValue !== undefined && emptyValue !== null ? emptyValue : '$0';
        }
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numero);
      };
    },
    solicitudesFiltradas() {
      if (!this.store.solicitudes) return [];

      return this.store.solicitudes.filter(sol => {
        // Filtro por búsqueda global
        if (this.busqueda) {
          const needle = this.busqueda.toLowerCase();
          const matchesSearch =
            (sol.nombreOrden && sol.nombreOrden.toLowerCase().includes(needle)) ||
            (sol.id && sol.id.toLowerCase().includes(needle));

          if (!matchesSearch) return false;
        }

        // Filtro por estado (Chips/Cards)
        if (this.filtroEstado && sol.estado !== this.filtroEstado) {
          return false;
        }

        return true;
      });
    },
    tableResultsKey() {
      if (this.store.loading) {
        return 'loading';
      }

      const ids = this.solicitudesFiltradas.map((sol) => sol.id).join('-');
      return [
        ids,
        this.busqueda,
        this.filtroEstado,
        this.filtroFechaInicio,
        this.filtroFechaFin
      ].join('|');
    },
    consumoPorcentaje() {
      if (!this.selectedSolicitud) return 0;
      const total = Number(this.selectedSolicitud.presupuestoDisponible) || 1;
      const ejecutado = this.calcularTotalProductos(this.selectedSolicitud);
      return Math.min(Math.round((ejecutado / total) * 100), 100);
    },
    consumoProgressValue() {
      if (!this.selectedSolicitud) return 0;
      const total = Number(this.selectedSolicitud.presupuestoDisponible) || 1;
      const ejecutado = this.calcularTotalProductos(this.selectedSolicitud);
      return Math.min(ejecutado / total, 1);
    },
    progressColorClass() {
      const pct = this.consumoPorcentaje;
      if (pct >= 10 && pct <= 25) return 'progress--green';
      if (pct >= 50 && pct <= 80) return 'progress--sky';
      if (pct > 80) return 'progress--danger';
      return '';
    },
    productColumns() {
      return [
        { name: 'descripcion', label: 'Producto/Servicio', field: 'descripcion', align: 'left' },
        { name: 'cantidad', label: 'Cant.', field: 'cantidad', align: 'center' },
        { name: 'unidadMedida', label: 'Unidad', field: 'unidadMedida', align: 'center' },
        { name: 'valorUnitario', label: 'V. Unitario', field: 'valorUnitario', align: 'right' },
        { name: 'acciones', label: '', field: 'acciones', align: 'center' },
      ];
    },
    totalProductosServicios() {
      let total = 0;
      total = this.selectedSolicitud.proyectos.reduce((acc, proy) => {
        return acc + (proy.productosServicios || []).reduce((acc, prod) => {
          return acc + (Number(prod.cantidad) || 0) * (Number(prod.valorUnitario) || 0);
        }, 0) || 0;
      }, 0) || 0;

      if (total <= 0) {
        total = 0;
      }
      return total;
    }
  },
  async mounted() {
    await Promise.all([
      this.reloadSolicitudes(),
      this.evaluarPermisoAprobacion(),
    ]);
  },
  methods: {
    obtenerRubrosAfectados(solicitud) {
      if (!solicitud || !solicitud.proyectos) return [];
      const rubrosMap = {};
      solicitud.proyectos.forEach(function (p) {
        if (p.item && p.porcentaje > 0) {
          if (!rubrosMap[p.item]) {
            rubrosMap[p.item] = 0;
          }
          rubrosMap[p.item] += p.porcentaje;
        }
      });
      return Object.keys(rubrosMap).map(function (nombre) {
        return nombre + ' (' + rubrosMap[nombre].toFixed(1) + '%)';
      });
    },
    async evaluarPermisoAprobacion() {
      this.permisoAprobacionResuelto = false;
      this.usuarioPuedeAceptarAprobacion = false;
      this.usuarioPuedeEliminarSolicitud = false;
      this.aprobadorNombreSesion = '';

      const username = resolveUsernameFromSession(this.usuarioSesion);
      const result = await evaluateSupplyRequestApprovalPermission(username);

      this.usuarioPuedeAceptarAprobacion = !!result.canApprove;
      this.usuarioPuedeEliminarSolicitud = !!result.canDelete;
      this.permisoAprobacionResuelto = !!result.resolved;
      this.aprobadorNombreSesion = (result.collaboratorNombre || '').trim();
    },
    async reloadSolicitudes() {
      try {
        await this.store.fetchSolicitudes();
      } catch (error) {
        const message =
          (error && error.message) ||
          'Error al cargar las solicitudes registradas.';
        if (this.$q) {
          this.$q.notify({
            color: 'negative',
            message,
            timeout: 5000,
          });
        }
      }
    },
    getStatusClass(status) {
      if (!status) return 'status--registered';
      const s = status.toUpperCase();
      if (s === 'ACEPTADO' || s === 'APROBADO') return 'status--accepted';
      if (s === 'DEVUELTO') return 'status--returned';
      if (s === 'PENDIENTE') return 'status--pending';
      return 'status--registered';
    },
    setFiltroEstado(estado) {
      this.filtroEstado = (this.filtroEstado === estado) ? '' : estado;
    },
    contarEstado(estado) {
      if (!this.store.solicitudes) return 0;
      return this.store.solicitudes.filter(s => s.estado === estado).length;
    },
    getColorForStatus(status) {
      if (!status) return { bg: 'grey-4', text: 'grey-9' };
      const s = status.toUpperCase();

      switch (s) {
        case 'COMPLETADO':
        case 'APROBADO':
        case 'ACEPTADO':
          return { bg: 'green-1', text: 'green-9' }; // WCAG AA: High contrast
        case 'PENDIENTE':
          return { bg: 'orange-1', text: 'orange-9' };
        case 'RECHAZADO':
          return { bg: 'red-1', text: 'red-9' };
        default:
          return { bg: 'grey-2', text: 'grey-8' };
      }
    },
    async verDetalle(solicitud) {
      this.selectedSolicitud = solicitud;
      this.modalDetalle = true;
      await this.evaluarPermisoAprobacion();
    },
    onPlanOrderSelected(solicitud) {
      if (!solicitud) {
        return;
      }
      this.verDetalle(solicitud);
    },
    async confirmarAprobacion(solicitud) {
      if (!this.permisoAprobacionResuelto) {
        await this.evaluarPermisoAprobacion();
      }

      if (!this.usuarioPuedeAceptarAprobacion) {
        if (this.$q) {
          this.$q.notify({
            color: 'negative',
            icon: 'block',
            message: SUPPLY_REQUEST_APPROVAL_DENIED_MESSAGE,
            timeout: 5000,
          });
        }
        return;
      }

      this.selectedSolicitud = solicitud;
      this.showApproveModal = true;
    },
    confirmarDevolucion(solicitud) {
      this.selectedSolicitud = solicitud;
      this.returnNote = '';
      this.showReturnModal = true;
    },
    async onReturnConfirm() {
      if (!this.returnNote || !this.selectedSolicitud) {
        return;
      }

      try {
        await this.store.returnSolicitud(this.selectedSolicitud.id, this.returnNote);
        this.$q.notify({
          color: 'orange',
          icon: 'reply',
          message: 'Solicitud devuelta para corrección.',
        });
        this.showReturnModal = false;
        this.modalDetalle = false;
        await this.store.fetchSolicitudes();
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: (e && e.message) || 'Error al procesar la devolución.',
        });
      }
    },
    async confirmarEliminacion(solicitud) {
      if (!this.permisoAprobacionResuelto) {
        await this.evaluarPermisoAprobacion();
      }

      if (!this.usuarioPuedeEliminarSolicitud) {
        if (this.$q) {
          this.$q.notify({
            color: 'negative',
            icon: 'block',
            message: SUPPLY_REQUEST_DELETE_DENIED_MESSAGE,
            timeout: 5000,
          });
        }
        return;
      }

      if (!solicitud || !solicitud.id) {
        return;
      }

      this.$q.dialog({
        title: 'Eliminar solicitud',
        message: 'Esta acción es irreversible. ¿Desea eliminar la solicitud seleccionada?',
        cancel: true,
        persistent: true,
        color: 'negative',
        ok: {
          label: 'Eliminar',
          color: 'negative',
          unelevated: true,
        },
      }).onOk(async () => {
        try {
          await this.store.deleteSolicitud(solicitud.id);
          if (this.store.error) {
            throw new Error(this.store.error);
          }
          if (this.selectedSolicitud && this.selectedSolicitud.id === solicitud.id) {
            this.modalDetalle = false;
            this.selectedSolicitud = null;
          }
          this.$q.notify({
            color: 'positive',
            icon: 'delete',
            message: 'Solicitud eliminada correctamente.',
          });
        } catch (e) {
          this.$q.notify({
            color: 'negative',
            message: (e && e.message) || 'No se pudo eliminar la solicitud.',
          });
        }
      });
    },
    async onApproveConfirm(aprobadores) {
      if (!this.permisoAprobacionResuelto) {
        await this.evaluarPermisoAprobacion();
      }

      if (!this.usuarioPuedeAceptarAprobacion) {
        if (this.$q) {
          this.$q.notify({
            color: 'negative',
            icon: 'block',
            message: SUPPLY_REQUEST_APPROVAL_DENIED_MESSAGE,
            timeout: 5000,
          });
        }
        return;
      }

      try {
        const solicitudAprobada = this.selectedSolicitud;
        await this.store.approveSolicitud(this.selectedSolicitud.id, aprobadores);

        const rubrosAfectados = this.obtenerRubrosAfectados(solicitudAprobada);
        let mensaje = 'Solicitud aprobada correctamente.';
        if (rubrosAfectados.length > 0) {
          mensaje += ' Presupuesto descontado de: ' + rubrosAfectados.join(', ');
        }

        this.$q.notify({
          color: 'positive',
          icon: 'check_circle',
          message: mensaje,
          timeout: 8000,
        });
        this.showApproveModal = false;
        this.modalDetalle = false;
        await this.store.fetchSolicitudes();
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al procesar la aprobación.'
        });
      }
    },
    limpiarFiltros() {
      this.busqueda = '';
      this.filtroEstado = '';
      this.filtroFechaInicio = '';
      this.filtroFechaFin = '';
    },
    hasNombreOrden(solicitud) {
      return !!(solicitud && solicitud.nombreOrden && solicitud.nombreOrden.trim());
    },
    openEditOrderName(solicitud) {
      this.editingSolicitud = solicitud;
      this.orderNameError = '';
      this.showEditOrderNameModal = true;
    },
    async onOrderNameSaved(nombreOrden) {
      if (!this.editingSolicitud) {
        return;
      }

      this.orderNameError = '';

      try {
        const solicitudId = this.editingSolicitud.id;
        await this.store.updateOrderName(solicitudId, nombreOrden);

        const refreshed = this.store.solicitudes.find((item) => item.id === solicitudId);
        if (refreshed && this.selectedSolicitud && this.selectedSolicitud.id === solicitudId) {
          this.selectedSolicitud = refreshed;
        }

        this.showEditOrderNameModal = false;
        this.editingSolicitud = null;

        if (this.$q) {
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: 'Nombre de la orden actualizado correctamente.',
          });
        }
      } catch (error) {
        const message = (error && error.message) || 'No se pudo actualizar el nombre de la orden.';
        this.orderNameError = message;

        if (this.$q) {
          this.$q.notify({
            color: 'negative',
            icon: 'error',
            message,
            timeout: 5000,
          });
        }
      }
    },
    abrirEditar(solicitud) {
      const proyectosClonados = (solicitud.proyectos || []).map(proy => ({
        ...proy,
        productosServicios: (proy.productosServicios || []).map(prod => ({ ...prod })),
      }));
      this.editForm = {
        id: solicitud.id,
        nombreOrden: solicitud.nombreOrden || '',
        subdireccion: solicitud.subdireccion || '',
        descripcionNecesidad: solicitud.descripcionNecesidad || '',
        departamento: solicitud.departamento || '',
        municipio: solicitud.municipio || '',
        direccion: solicitud.direccion || '',
        contacto: solicitud.contacto || '',
        telefono: solicitud.telefono || '',
        fechaEntrega: solicitud.fechaEntrega || '',
        requiereFlete: !!solicitud.requiereFlete,
        garantias: solicitud.garantias || '',
        observacionesProductos: solicitud.observacionesProductos || '',
        departamentoId: solicitud.departamentoId || null,
        departamentoNombre: solicitud.departamentoNombre || '',
        areaNombre: solicitud.areaNombre || '',
        presupuestoDisponible: solicitud.presupuestoDisponible || 0,
        proyectos: proyectosClonados,
      };
      this.selectedEditArea = solicitud.departamentoId || null;
      this.editError = '';
      this.modalEditar = true;
      this.loadEditAreas();
    },
    async loadEditAreas() {
      try {
        await this.departmentStore.fetchAll();
        this.areaOptions = buildDepartmentSelectOptions(this.departmentStore.departamentosActivos);
      } catch (err) {
        // Silenciar error
      }
    },
    onEditAreaSelected(departamentoId) {
      if (!departamentoId) {
        this.editForm.departamentoId = null;
        this.editForm.departamentoNombre = '';
        this.editForm.departamento = '';
        this.editForm.areaNombre = '';
        return;
      }
      var department = this.departmentStore.departments.find(function (d) {
        return d.id === departamentoId;
      });
      if (department) {
        this.editForm.departamentoId = department.id;
        this.editForm.departamentoNombre = department.name || department.nombre || '';
        this.editForm.departamento = department.name || department.nombre || '';
        var areas = Array.isArray(department.areas) ? department.areas : [];
        this.editForm.areaNombre = areas.length > 0
          ? (areas[0].name || areas[0].areaName || areas[0].nombre || '')
          : '';
      }
    },
    onProyectoPorcentajeChange(idx) {
      const proy = this.editForm.proyectos[idx];
      if (!proy) return;
      if (proy.porcentaje < 0) proy.porcentaje = 0;
      if (proy.porcentaje > 100) proy.porcentaje = 100;
      proy.presupuestoAsignado = this.calcularPresupuestoAsignadoProyecto(proy) || 0;
    },
    calcularPresupuestoAsignadoProyecto(proyecto) {
      if (!proyecto) {
        return null;
      }

      const asignado = Number(proyecto.presupuestoAsignado);
      const disponibleRubro = Number(proyecto.productosServicios.reduce((acc, prod) => {
        return acc + (Number(prod.cantidad) || 0) * (Number(prod.valorUnitario) || 0);
      }, 0) || 0);
      const porcentaje = Number(proyecto.porcentaje);

      console.log('asignado', asignado);
      console.log('disponibleRubro', disponibleRubro);
      console.log('porcentaje', porcentaje);

      let currency = this.formatMonedaColombiana(disponibleRubro);
      return currency;
    },
    formatPresupuestoAsignadoProyecto(proyecto, emptyValue) {
      const monto = this.calcularPresupuestoAsignadoProyecto(proyecto);
      console.log('monto', monto);
      return monto;
    },
    formatPorcentajeProyecto(proyecto) {
      if (!proyecto) {
        return '';
      }
      const value = Number(proyecto.porcentaje);
      if (isNaN(value) || value <= 0) {
        return '';
      }
      return Number.isInteger(value) ? value + '%' : value.toFixed(1) + '%';
    },
    agregarProducto(proyectoIdx) {
      const proy = this.editForm.proyectos[proyectoIdx];
      if (!proy) return;
      if (!proy.productosServicios) {
        proy.productosServicios = [];
      }
      proy.productosServicios.push({
        id: null,
        descripcion: '',
        cantidad: 1,
        unidadMedida: '',
        valorUnitario: 0,
        fechaInicio: null,
        fechaFin: null,
      });
    },
    eliminarProducto(proyectoIdx, productoIdx) {
      const proy = this.editForm.proyectos[proyectoIdx];
      if (!proy || !proy.productosServicios) return;
      proy.productosServicios.splice(productoIdx, 1);
    },
    async guardarEdicion() {
      this.editError = '';
      try {
        await this.store.updateSolicitud(this.editForm);
        this.modalEditar = false;
        this.resumenEdicion = {
          nombreOrden: this.editForm.nombreOrden || '',
          subdireccion: this.editForm.subdireccion || '',
          descripcionNecesidad: this.editForm.descripcionNecesidad || '',
          areaNombre: this.editForm.areaNombre || '',
          departamento: this.editForm.departamento || '',
          municipio: this.editForm.municipio || '',
          direccion: this.editForm.direccion || '',
          contacto: this.editForm.contacto || '',
          telefono: this.editForm.telefono || '',
          fechaEntrega: this.editForm.fechaEntrega || '',
          requiereFlete: this.editForm.requiereFlete || false,
          garantias: this.editForm.garantias || '',
          observacionesProductos: this.editForm.observacionesProductos || '',
        };
        this.modalResumenEdicion = true;
      } catch (e) {
        this.editError = (e && e.message) || 'No se pudo actualizar la solicitud.';
      }
    },
    cerrarResumenEdicion() {
      this.modalResumenEdicion = false;
      this.resumenEdicion = {};
    },
    calcularTotalProductos(solicitud) {
      // if (!solicitud || !solicitud.proyectos) return 0;
      let total = 0;
      solicitud.proyectos.forEach(proy => {
        if (proy.productosServicios) {
          proy.productosServicios.forEach(prod => {
            const cant = Number(prod.cantidad) || 0;
            const valor = Number(prod.valorUnitario) || 0;
            total += (cant * valor);
          });
        }
      });
      return total;
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
}

.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
  border-radius: 12px 12px 0 0;
}

.header-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-select-order,
.btn-nueva {
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 16px;
}

/* Summary */
.summary-section {
  border-bottom: 1px solid #f1f5f9;
}

.summary-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 0 4px;
}

.summary-stat__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.01em;
}

.summary-stat__value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  font-variant-numeric: tabular-nums;
}

/* Filtros */
.filter-chips-row {
  flex-wrap: wrap;
  padding-bottom: 8px;
  gap: 8px;
}

.filter-dates-row {
  padding-top: 2px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.filter-btn:active {
  transition-duration: 0.1s;
}

.filter-btn__icon {
  font-size: 16px;
}

.filter-btn__label {
  line-height: 1;
}

.filter-btn__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

/* Active states */
.filter-btn--active {
  opacity: 1 !important;
}

.filter-btn--pendiente.filter-btn--active {
  background: #fff7ed;
  border-color: #f97316;
  color: #c2410c;
}

.filter-btn--pendiente.filter-btn--active .filter-btn__badge {
  background: #fed7aa;
  color: #c2410c;
}

.filter-btn--aceptado.filter-btn--active {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}

.filter-btn--aceptado.filter-btn--active .filter-btn__badge {
  background: #bbf7d0;
  color: #15803d;
}

.filter-btn--devuelto.filter-btn--active {
  background: #fef2f2;
  border-color: #ef4444;
  color: #b91c1c;
}

.filter-btn--devuelto.filter-btn--active .filter-btn__badge {
  background: #fecaca;
  color: #b91c1c;
}

.filter-btn--todos {
  border-color: #94a3b8;
  color: #475569;
}

.filter-btn--todos:hover {
  background: #f1f5f9;
  border-color: #64748b;
}

/* Tabla Escaneable */
.table-header-row {
  background-color: #f1f5f9;
}

.header-th {
  font-weight: 800 !important;
  color: #475569 !important;
  text-transform: uppercase;
  font-size: 11px !important;
  letter-spacing: 0.05em;
  padding: 16px !important;
}

.solicitudes-table ::v-deep tr {
  transition: background-color 0.2s ease;
}

.solicitudes-table.table-animate ::v-deep tbody tr {
  opacity: 0;
  animation: table-row-fade-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(1) {
  animation-delay: 0ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(2) {
  animation-delay: 45ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(3) {
  animation-delay: 90ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(4) {
  animation-delay: 135ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(5) {
  animation-delay: 180ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(6) {
  animation-delay: 225ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(7) {
  animation-delay: 270ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(8) {
  animation-delay: 315ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(9) {
  animation-delay: 360ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(10) {
  animation-delay: 405ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(11) {
  animation-delay: 450ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(12) {
  animation-delay: 495ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(13) {
  animation-delay: 540ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(14) {
  animation-delay: 585ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(15) {
  animation-delay: 630ms;
}

.solicitudes-table.table-animate ::v-deep tbody tr:nth-child(n + 16) {
  animation-delay: 675ms;
}

@keyframes table-row-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .solicitudes-table.table-animate ::v-deep tbody tr {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

.solicitudes-table ::v-deep tr:hover {
  background-color: #f1f5f9 !important;
}

.solicitudes-table ::v-deep td {
  padding: 16px !important;
  border-bottom: 1px solid #f1f5f9;
}

/* Celdas específicas */
.text-order-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
}

.btn-assign-name,
.btn-assign-name-detail {
  font-weight: 600;
}

.text-id-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #94a3b8;
  letter-spacing: -0.01em;
}

.text-fecha {
  font-weight: 500;
  color: #64748b;
}

.text-presupuesto {
  font-weight: 700;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
}

/* Badges de Estado */
.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status--accepted {
  background-color: #dcfce7;
  color: #166534;
}

.status--returned {
  background-color: #fee2e2;
  color: #991b1b;
}

.status--pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status--registered {
  background-color: #f1f5f9;
  color: #475569;
}

/* Acciones */
.action-btn-ver {
  font-weight: 700;
  border-radius: 6px;
  padding: 4px 12px;
}

.action-btn-ver:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

/* Modal Detalle (Refactorizado: Dashboard Style) */
.modal-detail-card {
  max-width: 850px;
  width: 100%;
  height: 100vh;
  border-radius: 0;
  /* En panel lateral, bordes rectos para full-height */
  display: flex;
  flex-direction: column;
}

.modal-header-sticky {
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.modal-body-content {
  background-color: #ffffff;
}

.kpi-card {
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.kpi-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Barra de progreso de consumo ── */
.consumo-progress {
  transition: all 0.5s ease;
}

/* Naranja cromático: 10% - 25% */
.consumo-progress.progress--green ::v-deep(.q-linear-progress__track) {
  background: #fff3e0 !important;
}

.consumo-progress.progress--green ::v-deep(.q-linear-progress__model) {
  background: linear-gradient(90deg, #e65100 0%, #ef6c00 30%, #fb8c00 60%, #ffa726 100%) !important;
}

/* Azul cielo cromático: 50% - 80% */
.consumo-progress.progress--sky ::v-deep(.q-linear-progress__track) {
  background: #e1f5fe !important;
}

.consumo-progress.progress--sky ::v-deep(.q-linear-progress__model) {
  background: linear-gradient(90deg, #0288d1 0%, #03a9f4 30%, #29b6f6 60%, #4fc3f7 100%) !important;
}

/* Naranja a Rojo: 80% - 100% (con pulso) */
.consumo-progress.progress--danger ::v-deep(.q-linear-progress__track) {
  background: #fff3e0 !important;
}

.consumo-progress.progress--danger ::v-deep(.q-linear-progress__model) {
  background: linear-gradient(90deg, #ef6c00 0%, #f57c00 30%, #e53935 70%, #c62828 100%) !important;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {

  0%,
  100% {
    opacity: 1;
    filter: brightness(1);
  }

  50% {
    opacity: 0.82;
    filter: brightness(1.15);
  }
}

.consumo-label {
  min-width: 100px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ── Input de porcentaje en timeline de edición ── */
.porcentaje-input {
  width: 110px;
}

.porcentaje-input ::v-deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  border-radius: 8px;
}

.porcentaje-input ::v-deep(.q-field__native) {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #0d9488;
}

.observation-box {
  background: #f8fafc;
  border-left: 4px solid #94a3b8;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #475569;
}

.border-dashed {
  border: 2px dashed #e2e8f0;
}

.label-style {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 2px;
}

.value-style {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
  display: block;
  margin-bottom: 0.75rem;
  margin-left: 0;
}

.close-btn-44 {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal Editar */
.modal-edit-card {
  max-width: 850px;
  width: 100%;
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.action-btn-editar {
  font-weight: 700;
  border-radius: 6px;
  padding: 4px 12px;
}

.action-btn-editar:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

/* ── Project Card (Modal Detalle / Editar) ── */
.project-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  transition: box-shadow 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.project-card__header {
  background: linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
}

.project-card__body {
  border-bottom: 1px solid #f1f5f9;
}

.project-card__products {
  padding-top: 12px;
}

/* ── Link Timeline (Línea conectora vertical) ── */
.link-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 4px;
}

.link-timeline__node {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-height: 48px;
}

.link-timeline__dot {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.link-timeline__dot--primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.link-timeline__dot--orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.link-timeline__dot--teal {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.link-timeline__content {
  flex: 1;
  padding-top: 2px;
}

.link-timeline__label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.2;
}

.link-timeline__value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.4;
}

.link-timeline__value--highlight {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.link-timeline__amount {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  font-family: 'JetBrains Mono', monospace;
}

.link-timeline__percentage {
  display: inline-flex;
  align-items: center;
  background: #ECFDF5;
  color: #047857;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

/* Línea conectora entre nodos */
.link-timeline__line {
  width: 2px;
  height: 24px;
  margin-left: 17px;
  background: linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 100%);
  border-radius: 1px;
  position: relative;
}

.link-timeline__line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
}

.solicitudes-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px 48px;
  text-align: center;
}

.solicitudes-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(116, 175, 126, 0.35);
}

.solicitudes-empty-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.solicitudes-empty-desc {
  font-size: 14px;
  color: #64748b;
  max-width: 420px;
  line-height: 1.6;
  margin-bottom: 4px;
}

.solicitudes-empty-btn {
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%) !important;
  color: #fff !important;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 600;
}
</style>
