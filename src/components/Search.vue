<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid" @keyup.native.enter="search(title, selected); info(title, selected)" ref="form" lazy-validation>
        <v-text-field label="Szukaj napisów" v-model="title" :rules="titleRules" required></v-text-field>
        <v-select label="Jezyk tytułu" v-model="selected" :items="types" item-text="text" item-value="value" :rules="selectRules" required></v-select>
        <v-btn @click="search(title, selected); info(title, selected)" round outline color="primary" :disabled="!valid">Szukaj</v-btn>
      </v-form>
      <v-progress-linear v-if="loading || malLoading" :indeterminate="loading || malLoading" :active="loading || malLoading" />
      <info v-if="malData && !malLoading" :mal="malData"></info>
      <v-alert v-else :value="malError" color="error" icon="warning" outline>
        {{malError}}
      </v-alert>
      <div v-if="data && !loading">
        <div v-if="data.json">
          <download :animes="data.json"></download>
          <v-pagination v-if="data.pages > 1" prev-icon="navigate_before" next-icon="navigate_next" v-model="page" :length="data.pages" :total-visible="10" @input="search(title, selected)"></v-pagination>
        </div>
        <v-alert v-else value="true" color="info" icon="info" outline>
          Nie znaleziono napisów
        </v-alert>
      </div>
      <v-alert v-else :value="error" color="error" icon="warning" outline>
        {{error}}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import * as searchActions from '../store/modules/search/actions.types'
import * as infoActions from '../store/modules/info/actions.types'
import { mapGetters } from 'vuex'
import Info from '@/components/Info.vue'
import Download from '@/components/Download.vue'
export default {
  name: 'search',
  components: { Info, Download },
  data () {
    return {
      title: '',
      titleRules: [
        v => !!v || 'Pole jest wymagane',
        v => /^[^\s].*/.test(v) || 'Pole nie moze być puste'
      ],
      selectRules: [
        v => !!v || 'Język tytułu jest wymagany'
      ],
      types: [
        { text: 'oryginalny', value: 'org' },
        { text: 'polski', value: 'pl' },
        { text: 'angielski', value: 'en' }
      ],
      valid: true,
      selected: 'org',
      page: 1,
      show: false
    }
  },
  computed: {
    ...mapGetters({
      data: 'search/data',
      loading: 'search/loading',
      error: 'search/error',
      malData: 'info/data',
      malLoading: 'info/loading',
      malError: 'info/error'
    })
  },
  methods: {
    search (title, selected) {
      if (this.$refs.form.validate()) {
        this.$store.dispatch(`search/${searchActions.FETCH_BY_NAME}`, { title: title.trim(), selected: selected, page: this.page - 1 })
      }
    },
    info (title) {
      if (this.$refs.form.validate()) {
        this.$store.dispatch(`info/${infoActions.FETCH_BY_NAME}`, title)
      }
    }
  }
}
</script>
