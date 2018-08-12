<template>
  <v-card flat>
    <v-container fluid grid-list-lg>
      <v-layout row>

        <v-flex xs4>
          <v-card-media :src="mal.picture" height="350px" contain>
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox/>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-flex>

        <v-flex xs12>
          <v-card-title primary-title>
            <div>
              <div class="headline mb-1">{{ mal.title }}
                <v-chip label color="accent">
                  <v-icon left>star</v-icon>{{ mal.score }}/10</v-chip>
              </div>
              <v-chip outline>Type: {{ mal.type }}</v-chip>
              <v-chip outline>Episodes: {{ mal.episodes }}</v-chip>
              <v-chip outline>Ranked: {{ mal.ranked }}</v-chip>
              <v-chip outline>Members: {{ mal.members }}</v-chip>
              <v-chip outline>Aired: {{ mal.aired }}</v-chip>
              <div class="body-1">{{ mal.synopsis }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-chip v-for="(genre, key) in mal.genres" :key="key" label color="primary" text-color="white">
              <v-icon dark left>label</v-icon>{{ genre }}
            </v-chip>
          </v-card-text>
        </v-flex>

        <v-card-actions>
          <v-spacer/>
          <v-btn flat color="primary" @click="$electron.shell.openExternal(mal.url)">
            <v-icon>link</v-icon>
          </v-btn>
        </v-card-actions>

      </v-layout>
    </v-container>
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
