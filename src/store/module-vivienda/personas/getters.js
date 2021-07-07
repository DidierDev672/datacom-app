export function getPersonaState (state) {
  return state.persona
}

export function getPersonaPorNoOrden (state) {
  return function (id) {
    return state.persona.lista.find(persona => persona.noOrden === id)
  }
}
