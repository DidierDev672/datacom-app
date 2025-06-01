<template>
    <q-dialog
        persistent
        transition-show="scale"
        transition-hide="scale"
        v-model="show"
    >
        <q-card style="width: 700px;">
            <q-card-section>
                <div class="text-h6">
                     Agregar Producto o Servicio
                </div>
            </q-card-section>

            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form class="q-gutter-md">             
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">                            
                            <q-input
                                outlined
                                dense
                                v-model="product.item"
                                label="Descripción del item"
                                :rules="[requiredRule]"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12 col-md-6">
                            <q-input
                                outlined
                                dense
                                v-model="product.cantidad"
                                label="Cantidad"
                                type="number"
                                :rules="[requiredRule]"
                            />
                        </div>
                        <div class="col-xs-12 col-md-6">
                            <q-select 
                                label="Unidad de medida" 
                                dense 
                                outlined 
                                v-model="product.unidad" 
                                :options="unidades"
                                :rules="[requiredRule]"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                dense
                                v-model="product.valor"
                                label="Valor unitario"
                                type="number"
                                prefix="$"
                                :rules="[requiredRule]"
                            />
                        </div>
                    </div>
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Cancelar"
                    color="primary"                    
                    @click="close"
                />
                <q-btn
                    no-caps
                    label="Agregar item"
                    color="primary"
                    @click="onSubmit"
                >
                    <template v-slot:loading>
                        <q-spinner-facebook />
                    </template>
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { uid } from 'quasar'

export default {
    name: 'AgregarProductoForm',
    data() {
        return {
            show: true,
            product: this.iniciarModeloProducto(),
            unidades: [
                'Unidad',
                'Metro',
                'Kilogramo',
                'Litro',
                'Hora',
                'Día',
                'Mes',
                'Servicio'
            ],
            requiredRule: val => (val !== null && val !== '' && val !== undefined) || 'Este campo es obligatorio'
        };
    },
    methods: {  
        onSubmit() {            
            this.$emit('onSubmitProduct', this.product);
        },
        close() {
            this.$emit('close');
        },
        iniciarModeloProducto(){
            return {
                id: uid(),
                item: '',
                cantidad: 0,
                unidad: '',
                valor: 0
            }
        }
    }
};
</script> 