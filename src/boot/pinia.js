import { PiniaVuePlugin, createPinia } from 'pinia'

export default ({ Vue, app }) => {
  Vue.use(PiniaVuePlugin)
  const pinia = createPinia()
  app.pinia = pinia
}
