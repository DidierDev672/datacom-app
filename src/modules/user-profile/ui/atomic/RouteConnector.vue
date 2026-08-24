<template>
    <!--
        Átomo puro: solo dibuja el "punto" de la ruta y, si no es el último
        item, la línea que conecta con el siguiente. No sabe nada de rutas,
        solo recibe si debe o no dibujar la línea.
    -->
    <div class="router-connector">
        <span class="router-connector__dot" />
        <span v-if="!isLast" class="router-connector__line" />
    </div>
</template>
<script>
export default {
    name: 'RouteConnector',
    props: {
        isLast: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style scoped>
.router-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 24px;
    flex-shrink: 0;
}

.router-connector__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    /* Gradiente cromático verde para el punto */
    background: linear-gradient(135deg, #a7f3d0 0%, #10b981 60%, #065f46 100%);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}
</style>