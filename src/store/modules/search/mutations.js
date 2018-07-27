import * as actions from './actions.types'

export default {
  [actions.FETCH_BY_NAME] (state, payload) {
    state.data = payload
  },
  [actions.SET_LOADING] (state, payload) {
    state.loading = payload
  },
  [actions.SET_ERROR] (state, payload) {
    state.error = payload
  }
}
