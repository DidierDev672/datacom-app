<template>
  <v-tour
    name="datacomTour"
    :options="tourOptions"
    :steps="steps"
    :callbacks="vueTourCallbacks"
  ></v-tour>
</template>

<script>
export default {
  data() {
    return {
      tourOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: "Omitir recorrido",
          buttonPrevious: "Anterior",
          buttonNext: "Siguiente",
          buttonStop: "Finalizar"
        }
      },
      steps: [
        {
          target: ".v-step-0",
          content: "Alterna la barra de navegación lateral."
        },
        {
          target: ".v-step-1",
          content: "Opciones de encuestas para sistematizar.",
          params: {
            placement: "left"
          }
        },
        {
          target: ".v-step-2",
          content:
            "Aquí encontrarás las encuestas que están siendo diligenciadas.",
          params: {
            placement: "left"
          }
        },
        {
          target: ".v-step-3",
          content:
            "Esta opción te muestra las encuestas que ha sido marcadas como finalizadas.",
          params: {
            placement: "left"
          }
        },
        {
          target: ".v-step-4",
          content: "Si requieres salir del sistema, cierra tu sesión."
        }
      ],
      vueTourCallbacks: {
        onSkip: this.onSkip,
        onFinish: this.onFinish
      }
    };
  },
  methods: {
    onSkip(currentStep) {
      console.log("Hizo clic en el boton skip: ", currentStep);
    },
    onFinish(currentStep) {
      console.log("Hizo clic en el boton finish: ", currentStep);
    }
  },
  updated() {
    console.log("Tour update");
  },
  mounted() {
    // this.$tours["datacomTour"].start();
  }
};
</script>
