<template>

  <router-view :key="$route.path" />

</template>

<script>
// import { mapGetters } from 'vuex'
export default {

  //   data () {
  //   return {
  //     step: 1,
  //     objFichaVivienda: {},
  //     name: null,
  //     age: null,

  //     accept: false,
  //     options: [
  //       'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
  //     ]
  //   }
  // },
  // created () {
  //     this.objFichaVivienda = {...this.getFichaViviendaState.objVivienda}
  // },

  // methods: {
  //     onSubmit(){}
  // },
  // computed: {
  //     ...mapGetters('fichaVivienda', ['getFichaViviendaState']),
  //     ficha(){
  //         return this.getFichaViviendaState.objVivienda;
  //     }
  // }

}
</script>

<style lang="sass" scoped>
.column > div
  padding: 10px 15px
  background: rgba(86, 61, 124, .15)
  border: 1px solid rgba(86, 61, 124, .2)
.doc-container > div + div
  margin-top: 1rem
.column
  background: rgba(255, 0, 0, .1)
</style>
