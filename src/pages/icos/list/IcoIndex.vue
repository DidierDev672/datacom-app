<template>
  <div class="ico-dashboard">
    <!-- Header -->
    <div class="dashboard-header q-pa-md">
      <div class="row items-center">
        <div class="col">
          <h4 class="text-primary q-ma-none">Dashboard de Evaluaciones ICO</h4>
          <p class="text-grey-6 q-ma-none">Índice de Capacidades Organizacionales</p>
        </div>
        <div class="col-auto">
          <q-btn 
            color="primary" 
            icon="add" 
            label="Nueva Evaluación"
            :to="{ name: 'IcoCreate' }"
            class="q-mr-sm"
          />
          <q-btn 
            color="secondary" 
            icon="assessment" 
            label="Reportes"
            :to="{ name: 'PageMenuReporte' }"
            outline
          />
        </div>
      </div>
    </div>

    <!-- KPI Cards Section -->
    <div class="kpi-section q-pa-md">
      <div class="row q-gutter-md">
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card">
            <q-card-section class="text-center">
              <q-icon name="assessment" size="2.5rem" color="primary" />
              <div class="text-h5 text-primary q-mt-sm">{{ totalEvaluaciones }}</div>
              <div class="text-caption text-grey-6">Total Evaluaciones</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card">
            <q-card-section class="text-center">
              <q-icon name="business" size="2.5rem" color="secondary" />
              <div class="text-h5 text-secondary q-mt-sm">{{ totalOrganizaciones }}</div>
              <div class="text-caption text-grey-6">Organizaciones</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card">
            <q-card-section class="text-center">
              <q-icon name="trending_up" size="2.5rem" color="positive" />
              <div class="text-h5 text-positive q-mt-sm">{{ promedioPuntaje }}</div>
              <div class="text-caption text-grey-6">Puntaje Promedio</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card">
            <q-card-section class="text-center">
              <q-icon name="schedule" size="2.5rem" color="warning" />
              <div class="text-h5 text-warning q-mt-sm">{{ evaluacionesRecientes }}</div>
              <div class="text-caption text-grey-6">Últimos 30 días</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card kpi-card-best" v-if="mejorCalificacion">
            <q-card-section class="text-center">
              <q-icon name="emoji_events" size="2.5rem" color="positive" />
              <div class="text-h6 text-positive q-mt-sm">
                {{ mejorCalificacion.puntaje }}
              </div>
              <div class="text-caption text-grey-6">Mejor Calificación</div>
              <div class="text-caption text-grey-8 q-mt-xs" style="font-size: 10px; line-height: 1.2;">
                {{ mejorCalificacion.organizacion.length > 20 ? 
                    mejorCalificacion.organizacion.substring(0, 20) + '...' : 
                    mejorCalificacion.organizacion }}
              </div>
            </q-card-section>
            <q-tooltip class="bg-positive" anchor="top middle" self="bottom middle">
              Organización: {{ mejorCalificacion.organizacion }}<br/>
              Puntaje: {{ mejorCalificacion.puntaje }}
            </q-tooltip>
          </q-card>
          <q-card class="kpi-card" v-else>
            <q-card-section class="text-center">
              <q-icon name="emoji_events" size="2.5rem" color="grey-5" />
              <div class="text-h6 text-grey-5 q-mt-sm">--</div>
              <div class="text-caption text-grey-6">Mejor Calificación</div>
              <div class="text-caption text-grey-5" style="font-size: 10px;">
                Sin datos
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12">
          <q-card class="kpi-card kpi-card-worst" v-if="peorCalificacion">
            <q-card-section class="text-center">
              <q-icon name="trending_down" size="2.5rem" color="negative" />
              <div class="text-h6 text-negative q-mt-sm">
                {{ peorCalificacion.puntaje }}
              </div>
              <div class="text-caption text-grey-6">Menor Calificación</div>
              <div class="text-caption text-grey-8 q-mt-xs" style="font-size: 10px; line-height: 1.2;">
                {{ peorCalificacion.organizacion.length > 20 ? 
                    peorCalificacion.organizacion.substring(0, 20) + '...' : 
                    peorCalificacion.organizacion }}
              </div>
            </q-card-section>
            <q-tooltip class="bg-negative" anchor="top middle" self="bottom middle">
              Organización: {{ peorCalificacion.organizacion }}<br/>
              Puntaje: {{ peorCalificacion.puntaje }}
            </q-tooltip>
          </q-card>
          <q-card class="kpi-card" v-else>
            <q-card-section class="text-center">
              <q-icon name="trending_down" size="2.5rem" color="grey-5" />
              <div class="text-h6 text-grey-5 q-mt-sm">--</div>
              <div class="text-caption text-grey-6">Menor Calificación</div>
              <div class="text-caption text-grey-5" style="font-size: 10px;">
                Sin datos
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Escala de Fortalecimiento Section -->
    <div class="scale-section q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Escala de Fortalecimiento Organizacional</div>
          <div class="row q-gutter-md">
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="scale-item">
                <q-chip color="red" text-color="white" label="1 - Inferior" class="full-width" />
                <div class="text-caption q-mt-sm">Plan de choque urgente</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="scale-item">
                <q-chip color="orange" text-color="white" label="2 - Medio" class="full-width" />
                <div class="text-caption q-mt-sm">Plan de mejora mediano plazo</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="scale-item">
                <q-chip color="yellow" text-color="white" label="3 - Intermedio" class="full-width" />
                <div class="text-caption q-mt-sm">Plan de mejora mediano plazo</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="scale-item">
                <q-chip color="green" text-color="white" label="4 - Superior" class="full-width" />
                <div class="text-caption q-mt-sm">Plan mejoramiento continuo</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-section q-pa-md">
      <div class="row q-gutter-md">
        <div class="col-lg-8 col-md-7 col-sm-12 col-xs-12">
          <q-card class="chart-card">
            <q-card-section>
              <div class="text-h6 q-mb-md">Distribución de Puntajes</div>
              <div class="chart-container">
                <score-distribution-chart 
                  :data="distributionData" 
                  v-if="distributionData"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-5 col-sm-12 col-xs-12">
          <q-card class="chart-card">
            <q-card-section>
              <div class="text-h6 q-mb-md">Estado Organizacional</div>
              <div class="chart-container doughnut-container">
                <organizational-status-chart 
                  :data="statusData" 
                  v-if="statusData"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Location Analysis Section -->
    <div class="location-section q-pa-md">
      <div class="row q-gutter-md">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card class="chart-card">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <div class="col">
                  <div class="text-h6">Top 10 Municipios</div>
                </div>
                <div class="col-auto">
                  <q-chip 
                    size="sm" 
                    color="primary" 
                    text-color="white" 
                    icon="place"
                    :label="`${locationData ? locationData.labels.length : 0} municipios`"
                    v-if="locationData"
                  />
                </div>
              </div>
              <div class="chart-container">
                <location-chart 
                  :data="locationData" 
                  v-if="locationData"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-card class="chart-card">
            <q-card-section>
              <div class="text-h6 q-mb-md">Tendencias Temporales</div>
              <div class="chart-container">
                <temporal-trends-chart 
                  :data="trendsData" 
                  v-if="trendsData"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Summary Table Section -->
    <div class="summary-section q-pa-md">
      <q-card>
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6">Resumen de Evaluaciones</div>
            </div>
            <div class="col-auto">
              <q-input
                dense
                debounce="300"
                color="primary"
                v-model="filter"
                placeholder="Filtrar organizaciones..."
                @input="saveFilter()">
                <template v-slot:append>
                  <q-icon v-if="filter.length < 1" name="search" />
                  <q-icon v-else name="clear" @click="removeFilter()" />
                </template>
              </q-input>
            </div>
          </div>
          
          <q-table
            :data="icos"
            :columns="summaryColumns"
            :pagination.sync="pagination"
            :filter="filter"
            @request="onRequest"
            row-key="evaluacionId"
            @row-click="seleccionar"
            flat
            bordered
            :loading="getIcoState.loading"
            loading-label="Cargando información..."
            class="summary-table"
          >
            <template v-slot:body-cell-puntaje="props">
              <q-td :props="props">
                <q-chip 
                  :color="getScoreColor(props.row.puntaje)"
                  text-color="white"
                  :label="props.row.puntaje"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn 
                  flat 
                  round 
                  icon="visibility" 
                  @click.stop="verEvaluacion(props.row)"
                  size="sm"
                  color="primary"
                >
                  <q-tooltip>Ver evaluación</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { TIPO_ENCUESTA } from "src/utils/config";
import { openDB } from "idb";
import ScoreDistributionChart from "src/components/charts/ScoreDistributionChart.vue";
import OrganizationalStatusChart from "src/components/charts/OrganizationalStatusChart.vue";
import LocationChart from "src/components/charts/LocationChart.vue";
import TemporalTrendsChart from "src/components/charts/TemporalTrendsChart.vue";

export default {
  name: "IcoDashboard",
  components: {
    ScoreDistributionChart,
    OrganizationalStatusChart,
    LocationChart,
    TemporalTrendsChart
  },
  data() {
    return {
      filter: "",
      icos: [],
      // KPI Data
      totalEvaluaciones: 0,
      totalOrganizaciones: 0,
      promedioPuntaje: 0,
      evaluacionesRecientes: 0,
      mejorCalificacion: null,
      peorCalificacion: null,
      // Chart Data
      distributionData: null,
      statusData: null,
      locationData: null,
      trendsData: null,
      pagination: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      summaryColumns: [
        {
          name: "jac",
          align: "left",
          label: "Organización",
          field: "jac",
          sortable: true
        },
        {
          name: "ubicacion",
          align: "left",
          label: "Ubicación",
          field: "ubicacion",
          sortable: true
        },
        {
          name: "puntaje",
          align: "center",
          label: "Puntaje",
          field: "puntaje",
          sortable: true
        },
        {
          name: "fecha",
          align: "center",
          label: "Fecha",
          field: "fecha",
          sortable: true
        },
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        }
      ]
    };
  },
  created() {
    this.initializeDashboard();
  },
  methods: {
    ...mapActions("ico", ["cargarListaIcoAction"]),
    
    async initializeDashboard() {
      // Load filter from localStorage
      if(localStorage.getItem("filtroIco")){
        this.filter = localStorage.getItem("filtroIco");
      } else {
        this.filter = JSON.parse(localStorage.getItem("user"));
      }
      
      // Load dashboard data
      await this.loadDashboardData();
      await this.loadChartData();
    },
    
    async loadDashboardData() {
      try {
        const response = await this.cargarListaIcoAction({
          page: 0,
          rowsPerPage: 100, // Load more data for dashboard calculations
          filter: ""
        });
        
        const allEvaluations = response.data.content;
        
        // Calculate KPIs
        this.totalEvaluaciones = allEvaluations.length;
        this.totalOrganizaciones = new Set(allEvaluations.map(e => e.jac)).size;
        this.promedioPuntaje = allEvaluations.length > 0 ? 
          Math.round(allEvaluations.reduce((sum, e) => sum + (parseFloat(e.puntaje) || 0), 0) / allEvaluations.length * 100) / 100 : 0;
        
        // Count recent evaluations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        this.evaluacionesRecientes = allEvaluations.filter(e => 
          new Date(e.fecha) >= thirtyDaysAgo
        ).length;
        
        // Find best and worst performing organizations
        if (allEvaluations.length > 0) {
          const sortedByScore = allEvaluations
            .filter(e => e.puntaje && !isNaN(parseFloat(e.puntaje)))
            .sort((a, b) => parseFloat(b.puntaje) - parseFloat(a.puntaje));
          
          this.mejorCalificacion = sortedByScore.length > 0 ? {
            organizacion: sortedByScore[0].jac,
            puntaje: parseFloat(sortedByScore[0].puntaje).toFixed(2)
          } : null;
          
          this.peorCalificacion = sortedByScore.length > 0 ? {
            organizacion: sortedByScore[sortedByScore.length - 1].jac,
            puntaje: parseFloat(sortedByScore[sortedByScore.length - 1].puntaje).toFixed(2)
          } : null;
        }
        
        // Load summary table data
        this.onRequest({
          pagination: this.pagination,
          filter: this.filter
        });
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    },
    
    async loadChartData() {
      try {
        const response = await this.cargarListaIcoAction({
          page: 0,
          rowsPerPage: 1000, // Load all data for charts
          filter: ""
        });
        
        const allEvaluations = response.data.content;
        
        // Prepare chart data
        this.prepareDistributionData(allEvaluations);
        this.prepareStatusData(allEvaluations);
        this.prepareLocationData(allEvaluations);
        this.prepareTrendsData(allEvaluations);
        
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    },
    
    prepareDistributionData(evaluations) {
      // Always initialize all categories to ensure they appear in the chart
      const ranges = {
        'Inferior (1)': 0,
        'Medio (2)': 0,
        'Intermedio (3)': 0,
        'Superior (4)': 0
      };
      
      evaluations.forEach(e => {
        const score = parseFloat(e.puntaje) || 0;
        
        // Use exact ICO scale classification
        if (score >= 1 && score < 2) {
          ranges['Inferior (1)']++;
        } else if (score >= 2 && score < 3) {
          ranges['Medio (2)']++;
        } else if (score >= 3 && score < 4) {
          ranges['Intermedio (3)']++;
        } else if (score >= 4) {
          ranges['Superior (4)']++;
        } else {
          // For scores less than 1 or invalid scores
          ranges['Inferior (1)']++;
        }
      });
      
      // Ensure all categories are included even with 0 values
      const labels = ['Inferior (1)', 'Medio (2)', 'Intermedio (3)', 'Superior (4)'];
      const data = labels.map(label => ranges[label]);
      
      this.distributionData = {
        labels: labels,
        datasets: [{
          label: 'Número de Organizaciones',
          data: data,
          backgroundColor: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50'], // red, orange, yellow, green
          borderColor: ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c'],
          borderWidth: 1
        }]
      };
    },
    
    prepareStatusData(evaluations) {
      // Always initialize all categories to ensure they appear in the chart
      const statusCounts = {
        'Superior': 0,
        'Intermedio': 0,
        'Medio': 0,
        'Inferior': 0
      };
      
      evaluations.forEach(e => {
        const score = parseFloat(e.puntaje) || 0;
        
        // Use exact ICO scale classification - same as distribution chart
        if (score >= 4) {
          statusCounts['Superior']++;
        } else if (score >= 3 && score < 4) {
          statusCounts['Intermedio']++;
        } else if (score >= 2 && score < 3) {
          statusCounts['Medio']++;
        } else {
          statusCounts['Inferior']++;
        }
      });
      
      // Ensure consistent order and all categories are included
      const labels = ['Superior', 'Intermedio', 'Medio', 'Inferior'];
      const data = labels.map(label => statusCounts[label]);
      
      this.statusData = {
        labels: labels,
        datasets: [{
          label: 'Organizaciones',
          data: data,
          backgroundColor: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'], // green, yellow, orange, red
          borderColor: ['#388e3c', '#fbc02d', '#f57c00', '#d32f2f'],
          borderWidth: 2
        }]
      };
    },
    
    prepareLocationData(evaluations) {
      const locationCounts = {};
      evaluations.forEach(e => {
        // Extract municipality from location (assuming format "Municipality - Village" or similar)
        let municipality = e.ubicacion || 'Sin ubicación';
        
        // Try to extract municipality from location string
        if (municipality.includes('-')) {
          municipality = municipality.split('-')[0].trim();
        } else if (municipality.includes(',')) {
          municipality = municipality.split(',')[0].trim();
        }
        
        locationCounts[municipality] = (locationCounts[municipality] || 0) + 1;
      });
      
      // Sort by count and limit to top 10 municipalities to avoid overcrowding
      const sortedLocations = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      this.locationData = {
        labels: sortedLocations.map(([label]) => label),
        datasets: [{
          label: 'Evaluaciones',
          data: sortedLocations.map(([, count]) => count),
          backgroundColor: [
            '#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0',
            '#00bcd4', '#8bc34a', '#ffc107', '#e91e63', '#3f51b5'
          ]
        }]
      };
    },
    
    prepareTrendsData(evaluations) {
      const monthlyData = {};
      evaluations.forEach(e => {
        const date = new Date(e.fecha);
        const monthYear = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
      });
      
      this.trendsData = {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Evaluaciones',
          data: Object.values(monthlyData),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true
        }]
      };
    },
    
    seleccionar(evt, row, index) {
      this.$router.push({ name: "IcoView", params: { id: row.evaluacionId } });
    },
    
    verEvaluacion(row) {
      this.$router.push({ name: "IcoView", params: { id: row.evaluacionId } });
    },
    
    editarEvaluacion(row) {
      // Navigate to edit page if it exists
      console.log("Editar evaluación:", row);
    },
    
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      if(filter.length > 0 && filter.length < 3){
        return;
      }

      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      const startRow = page - 1;

      this.cargarListaIcoAction({
        page: startRow,
        rowsPerPage: fetchCount,
        filter: filter
      }).then(response => {
        this.pagination.rowsNumber = response.data.totalElements;
        this.icos.splice(0, this.icos.length, ...response.data.content);
      });

      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
    },

    saveFilter(){
      localStorage.setItem("filtroIco", this.filter);
    },

    removeFilter(){
      this.filter = '';
      localStorage.removeItem("filtroIco");
    },
    
    getScoreColor(score) {
      const numScore = parseFloat(score) || 0;
      // Use exact ICO scale classification
      if (numScore >= 4) return 'positive';    // Superior - green
      if (numScore >= 3) return 'warning';     // Intermedio - yellow
      if (numScore >= 2) return 'orange';      // Medio - orange  
      return 'negative';                       // Inferior - red
    }
  },
  computed: {
    ...mapGetters("ico", ["getIcoState"])
  }
};
</script>

<style lang="scss" scoped>
.ico-dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .kpi-section {
    margin-bottom: 16px;
    
    .row {
      margin: -8px;
      
      > div {
        padding: 8px;
      }
    }
    
    @media (min-width: 1920px) {
      .row > div {
        flex: 0 0 16.666667%;
        max-width: 16.666667%;
      }
    }
  }
  
  .scale-section,
  .charts-section,
  .location-section,
  .summary-section {
    margin-bottom: 16px;
  }
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.kpi-card {
  height: 140px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  &.kpi-card-best {
    border-left: 4px solid #4caf50;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
  }
  
  &.kpi-card-worst {
    border-left: 4px solid #f44336;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }
  }
  
  @media (max-width: 1200px) {
    height: 130px;
  }
  
  @media (max-width: 768px) {
    height: 120px;
  }
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  min-height: 250px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 250px;
    min-height: 200px;
  }
  
  &.doughnut-container {
    height: 380px;
    min-height: 320px;
    padding: 15px;
    
    @media (max-width: 768px) {
      height: 320px;
      min-height: 280px;
      padding: 10px;
    }
  }
}

.summary-table {
  .q-table__top {
    padding: 12px 16px;
  }
}

.kpi-section,
.scale-section,
.charts-section,
.location-section,
.summary-section {
  .q-card {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
  }
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .q-card-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .chart-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.doughnut-container {
        align-items: flex-start;
        padding-top: 20px;
      }
    }
  }
}

.scale-item {
  text-align: center;
  
  .q-chip {
    font-weight: 600;
    padding: 8px 16px;
  }
}
</style>
