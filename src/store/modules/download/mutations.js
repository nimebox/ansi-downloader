import * as actions from './actions.types'

export default {
  [actions.SET_LOADING] (state, payload) {
    state.loading = payload
  },
  [actions.SET_ERROR] (state, payload) {
    state.error = payload
  }
}
