import { PiniaVuePlugin } from 'pinia'
import { pinia } from 'src/stores/pinia'

export default ({ Vue, app }) => {
  Vue.use(PiniaVuePlugin)
  app.pinia = pinia
}
