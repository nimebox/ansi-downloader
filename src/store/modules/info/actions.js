import mal from 'mal-scraper'
import * as action from './actions.types'

export default {
  async [action.FETCH_BY_NAME] (store, payload) {
    store.commit(action.SET_LOADING, true)
    try {
      const data = await mal.getInfoFromName(payload)
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
