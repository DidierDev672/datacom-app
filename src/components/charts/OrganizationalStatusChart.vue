<script>
import { Doughnut } from 'vue-chartjs';

export default {
  name: 'OrganizationalStatusChart',
  extends: Doughnut,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 30,
            left: 15,
            right: 15
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              boxWidth: 12,
              boxHeight: 12,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        },
        cutout: '60%'
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderChart(this.data, this.options);
      }
    }
  }
};
</script> 