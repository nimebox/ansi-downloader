import animesub from 'animesub-api'
import * as action from './actions.types'
const { dialog } = require('electron').remote
export default {
  async [action.DOWNLOAD] (store, { id, sh, title }) {
    store.commit(action.SET_LOADING, true)
    try {
      let logs = null
      dialog.showSaveDialog(
        {
          title: 'Zapisz plik',
          defaultPath: `${title}_${id}.zip`,
          filters: [
            {
              name: 'zip',
              extensions: ['zip']
            }
          ]
        },
        async (fileName) => {
          if (!fileName) {
            console.log('File not saved')
          }
          const logss = await animesub.download(id, sh, fileName)
          logs = logss
        }
      )
      console.log(logs)
      store.commit(action.DOWNLOAD, logs)
    } catch (err) {
      console.error(err)
      store.commit(action.SET_ERROR, err.message)
    } finally {
      store.commit(action.SET_LOADING, false)
    }
  }
}
