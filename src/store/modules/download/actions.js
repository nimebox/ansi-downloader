import fs from 'fs'
import animesub from 'animesub-api'
import * as action from './actions.types'
const { dialog } = require('electron').remote
export default {
  async [action.DOWNLOAD] (store, { id, sh, title }) {
    store.commit(action.SET_LOADING, true)
    try {
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
        async (filename) => {
          if (!filename) {
            console.log('File not saved by user')
          } else {
            const data = await animesub.download(id, sh)
            fs.writeFile(filename, data, (err) => {
              if (err) {
                throw new Error(err)
              } else {
                console.log('File succesfully saved by user')
              }
            })
          }
        }
      )
    } catch (err) {
      console.error(err)
      store.commit(action.SET_ERROR, err.message)
    } finally {
      store.commit(action.SET_LOADING, false)
    }
  }
}
