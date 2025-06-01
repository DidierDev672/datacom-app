<script>
import { HorizontalBar } from 'vue-chartjs';
import { mapGetters, mapActions } from 'vuex';
export default {
    extends: HorizontalBar,
    props: {
        municipioID: {
            type: String,
            default: '37',
        },
    },
    data() {
        return {
            chartdata: {},
            options: {
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
    mounted() {
      console.log('BarChart: ', this.municipioID)
        this.reporteFichaMunicipioAction(this.municipioID).then((data) => {
            console.log('Child data: ', data);
            this.chartdata = {
                labels: Object.keys(data.poblacionRango),
                datasets: [
                    {
                        label: 'Población por rangos de Edad',
                        backgroundColor: '#64c2c8',
                        data: Object.values(data.poblacionRango),
                    },
                ],
            };
            console.log('Parent 2: ', this.chartdata);
            this.renderChart(this.chartdata, this.options);
        });
    },
    updated(){
      console.log('BarChart update: ', this.municipioID)
    },
    methods: {
        ...mapActions('reporteFichaMunicipio', ['reporteFichaMunicipioAction']),
    },
};
</script>

<style lang="scss" scoped></style>
