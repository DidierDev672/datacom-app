// Mutaciones generales

export function inicializarAccion (state) {
  state.fileManager = {
    ...state.fileManager,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.fileManager = {
    ...state.fileManager,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

// Mutaciones para la lista de categorias

export function setListaFileManagerSuccess (state, data) {
  state.fileManager = {
    ...state.fileManager,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaFileManager (state) {
  state.fileManager = {
    ...state.fileManager,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setFileManagerSuccess (state, data) {
  state.fileManager = {
    ...state.fileManager,
    objFileManager: data,
    loading: false,
    loaded: true
  }
}
export function actualizarFileManagerSuccess (state, data) {
  state.fileManager.lista = state.fileManager.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.fileManager.loading = false
  state.fileManager.loaded = true
}

export function agregarFileManagerState (state, data) {
  state.fileManager.lista.unshift(data)
}

export function unsetFileManager (state) {
  state.fileManager = {
    ...state.fileManager,
    objFileManager: {},
    loading: false,
    loaded: false
  }
}

export function eliminarFileManager (state, data) {
  state.fileManager = {
    ...state.fileManager,
    lista: state.fileManager.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
