// src/directives/tooltip.js
export default {
  bind(el, binding) {
    el.setAttribute('data-tooltip', binding.value)
    el.classList.add('has-tooltip')
  },
  update(el, binding) {
    el.setAttribute('data-tooltip', binding.value)
  }
}
