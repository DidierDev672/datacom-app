<script>
import { Line } from 'vue-chartjs';

export default {
  name: 'TemporalTrendsChart',
  extends: Line,
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
              maxRotation: 45,
              minRotation: 0
            }
          }
        },
        elements: {
          line: {
            tension: 0.3
          },
          point: {
            radius: 4,
            hoverRadius: 6
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