<template>
  <div>
    <v-list>
       <div v-for="(item, key) in animes" :key="key">
      <v-list-tile>
        <v-list-tile-content >
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-tooltip top color="secondary">
            <v-btn fab small outline color="primary" slot="activator" @click="download(item.id, item.sh, item.title)">
              <v-icon>get_app</v-icon>
            </v-btn>
            <span>Pobierz napisy</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider v-if="key + 1 < animes.length" :key="`divider-${key}`"></v-divider>
      </div>
    </v-list>
    <v-snackbar v-model="downloaded" :timeout="2000" auto-height color="white">
      <v-alert v-if="downloaded" :value="downloaded" color="success" icon="check_circle" outline>
        Plik zapisano pomyślnie
      </v-alert>
      <v-alert v-else :value="error" color="error" icon="warning" outline>
        {{error}}
      </v-alert>
    </v-snackbar>
  </div>
</template>

<script>
import * as actions from '../store/modules/download/actions.types'
import { mapGetters } from 'vuex'
export default {
  name: 'download',
  props: {
    animes: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      downloaded: 'download/downloaded',
      loading: 'download/loading',
      error: 'download/error'
    })
  },
  methods: {
    download (id, sh, title) {
      this.$store.dispatch(`download/${actions.DOWNLOAD}`, { id: id, sh: sh, title: title })
    }
  }
}
</script>
