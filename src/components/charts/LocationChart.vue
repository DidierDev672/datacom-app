<script>
import { Bar } from 'vue-chartjs';

export default {
  name: 'LocationChart',
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
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label; // Show full municipality name in tooltip
              },
              label: function(context) {
                return `Evaluaciones: ${context.parsed.x}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          },
          y: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              callback: function(value) {
                // Truncate long municipality names
                if (typeof value === 'string' && value.length > 15) {
                  return value.substring(0, 15) + '...';
                }
                return value;
              }
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