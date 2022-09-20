<template>
  <div>
    <apexcharts
      width="100%"
      type="radar"
      :options="options"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  props: {
    series: {
      type: Array,
      required: true
    },
    categorias: {
      type: Array,
      required: true
    }
  },
  components: { apexcharts: VueApexCharts },

  data() {
    return {
      options: {}
    };
  },
  created() {
    this.options = {
      //colors: ["#64c2c8", "#FEB019", "#008FFB"],
      chart: {
        id: "Ico"
      },
      theme: {
        palette: 'palette6'
      },
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColors: "#e9e9e9",
            fill: {
              colors: ["#f8f8f8", "#fff"]
            }
          }
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: this.categorias
      }
    };
  }
};
</script>
