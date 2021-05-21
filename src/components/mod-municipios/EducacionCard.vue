<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>Educación</q-item-label>
        </q-item-section>

        <q-item-section side top>              
            <div class="text-grey-8 ">
                <q-btn size="12px" flat dense round icon="more_vert" >
                    <q-menu cover auto-close>
                        <q-list>
                        <q-item clickable @click="editar">
                            <q-item-section>Editar información</q-item-section>
                        </q-item>
                        <q-item clickable>
                            <q-item-section>Eliminar</q-item-section>
                        </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>        
        </q-item-section>
    </q-item>

    <q-item-label header>Cobertura Educación Neta</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Transición
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaNetaTransicion }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        Básica Primaria
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ educacion.coberturaNetaBasicaPrimaria }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Básica secundaria
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaNetaBasicaSecundaria }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Educación Media
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaNetaEducacionMedia }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> 

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Total
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaNetaTotal }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>         

    <q-separator spaced />

    <q-item-label header>Cobertura Educación Bruta</q-item-label>


    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Transición
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaBrutaTransicion }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        Básica Primaria
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ educacion.coberturaBrutaBasicaPrimaria }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Básica secundaria
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaBrutaBasicaSecundaria }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Educación Media
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaBrutaEducacionMedia }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> 

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Total
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.coberturaBrutaTotal }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-separator spaced />

    <q-item-label header>Analfabetismo</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.tasaDeAnalfabestismoUrbano }}%</span>
            </q-item-label>
        </q-item-section>
    </q-item> 

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.tasaDeAnalfabestismoRural }}%</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-separator spaced />

    <q-item-label header>Pruebas saber 11</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Puntaje promedio en Matemáticas
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.puntajePromedioSaberMatematica }}%</span>
            </q-item-label>
        </q-item-section>
    </q-item> 

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Puntaje promedio en Lectura crítica
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ educacion.puntajePromedioSaberLectura }}%</span>
            </q-item-label>
        </q-item-section>
    </q-item>           

</q-list>
</template>

<script>
export default {
    props: {
        educacion: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.educacion)
      }
    }

}
</script>

<style>

</style>