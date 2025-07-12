<script>
import { Bar } from 'vue-chartjs';

export default {
  name: 'ScoreDistributionChart',
  extends: Bar,
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
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0
            }
          }
        },
        elements: {
          bar: {
            borderRadius: 4
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
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