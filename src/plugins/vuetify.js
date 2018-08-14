import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import colors from 'vuetify/es5/util/colors'

export default Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.base,
    secondary: colors.blue.darken1,
    accent: colors.yellow.accent3,
    error: colors.red.accent3
  }
})
