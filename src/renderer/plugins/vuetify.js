import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import colors from 'vuetify/es5/util/colors'

export default Vue.use(Vuetify, {
  theme: {
    primary: colors.pink.blue,
    secondary: colors.pink.darken1,
    accent: colors.yellow.accent3,
    error: colors.red.accent3
  }
})
