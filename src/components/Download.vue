<template>
  <v-list class="elevation-1">
    <v-list-tile v-for="(item, key) in animes" :key="key">
      <v-list-tile-content>
        <v-list-tile-title v-text="item.title"></v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn fab small class="elevation-0" slot="activator" @click="download(item.id, item.sh, item.title)">
            <v-icon color="primary">get_app</v-icon>
          </v-btn>
          <span>Pobierz napisy</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
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
      logs: 'download/logs',
      loading: 'download/loading',
      error: 'download/error'
    })
  },
  methods: {
    async download (id, sh, title) {
      await this.$store.dispatch(`download/${actions.DOWNLOAD}`, { id: id, sh: sh, title: title })
    }
  }
}
</script>
