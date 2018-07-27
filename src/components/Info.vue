<template>
  <v-card>
    <v-card-title class="headline" primary-title>
      Info z MyAnimeList
    </v-card-title>
    <v-card-media :src="mal.picture" height="200px">
    </v-card-media>
    <v-card-title primary-title>
      <div>
        <div class="headline">{{mal.title}}</div>
        <div class="grey--text">Aired: {{mal.aired}}</div>
        <div class="grey--text">Episodes: {{mal.episodes}}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-if="show">
        {{mal.synopsis}}
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
export default {
  name: 'info',
  props: {
    mal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>
