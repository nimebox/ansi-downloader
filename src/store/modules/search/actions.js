import animesub from 'animesub-api'
import * as action from './actions.types'

export default {
  async [action.FETCH_BY_NAME] (store, {title, selected, page}) {
    store.commit(action.SET_LOADING, true)
    try {
      const data = await animesub.search(title, selected, page)
      console.log(data)
      store.commit(action.FETCH_BY_NAME, data)
    } catch (err) {
      console.error(err)
      store.commit(action.SET_ERROR, err.message)
    } finally {
      store.commit(action.SET_LOADING, false)
    }
  }
}
