<script>
import { Bar } from 'vue-chartjs';
import { mapGetters, mapActions } from 'vuex';
export default {
    extends: Bar,
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
                    yAxes: [
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
        this.reporteFichaMunicipioAction(37).then((data) => {
            this.chartdata = {
                labels: ['Cobertura neta', 'Cobertura bruta'],
                datasets: [
                    {
                        label: 'Cobertura en educación',
                        backgroundColor: '#64c2c8',
                        data: [data.coberturaNeta, data.coberturaBruta],
                    },
                ],
            };

            this.renderChart(this.chartdata, this.options);
        });
    },
    methods: {
        ...mapActions('reporteFichaMunicipio', ['reporteFichaMunicipioAction']),
    },
};
</script>

<style lang="scss" scoped></style>
