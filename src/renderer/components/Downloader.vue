<template>
  <v-layout justify-center align-center row wrap>
    <v-flex xs12 sm8 md6>
      <v-container>
        <h3 class="text-xs-center">Szukaj napisów</h3>
        <v-card class="elevation-2">
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-layout row>
                  <v-flex>
                    <v-form v-model="valid" ref="form" lazy-validation>
                      <v-text-field label="Szukaj" v-model="title" :rules="[v => !!v || 'Pole jest wymagane']" required></v-text-field>
                      <v-select label="Typ" v-model="select" :items="types" :rules="[v => !!v || 'Typ jest wymagany']" required></v-select>
                      <v-btn @click.prevent="search(title, select); malInfo(title)" flat color="primary" :disabled="!valid">Szukaj</v-btn>
                    </v-form>
                    <v-alert :color="alertType" :icon="alertIcon" :value="info" v-model="info" transition="scale-transition" dismissible>
                      {{alertMsg}}
                    </v-alert>
                    <v-card v-show="done">
                      <v-card-title primary-title>
                        <div>
                          <div class="headline">Info z MyAnimeList</div>
                        </div>
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
                        <v-btn icon @click.native="show = !show">
                          <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                        </v-btn>
                      </v-card-actions>
                      <v-slide-y-transition>
                        <v-card-text v-show="show">
                          {{mal.synopsis}}
                        </v-card-text>
                      </v-slide-y-transition>
                    </v-card>
                    <v-list class="elevation-1" v-show="done">
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
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-form>
          <v-container>
            <div class="text-xs-center">
              <v-pagination :length="pages" v-model="page" v-show="done"></v-pagination>
            </div>
          </v-container>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import animesub from 'animesub-api'
  import mal from 'mal-scraper'
  export default {
    name: 'downloader',
    data () {
      return {
        title: '',
        animes: [],
        types: [
          'org',
          'pl',
          'en'
        ],
        valid: true,
        select: 'org',
        done: false,
        info: false,
        alertType: 'error',
        alertMsg: '',
        alertIcon: 'info',
        page: 1,
        pages: 0,
        mal: {
          title: '',
          synopsis: '',
          picture: '',
          aired: '?',
          episodes: '?'
        },
        show: false
      }
    },
    methods: {
      search (title, select) {
        if (this.$refs.form.validate()) {
          animesub.search(title, select, this.page - 1).then((data) => {
            if (data.json.length === 0) {
              console.log('array is empty')
              this.done = false
              this.info = true
              this.alertType = 'info'
              this.alertIcon = 'info'
              this.alertMsg = 'Brak wyników wyszukiwania.'
            } else {
              console.log(data)
              this.animes = data.json
              this.done = true
              this.pages = data.pages + 1
            }
          }).catch((err) => {
            console.log(err)
            this.done = false
            this.info = true
            this.alertType = 'error'
            this.alertIcon = 'warning'
            this.alertMsg = err
          })
        }
      },
      download (id, sh, title) {
        this.$electron.remote.dialog.showSaveDialog({
          title: 'Zapisz plik',
          defaultPath: `${title}_${id}.zip`,
          filters: [{
            name: 'zip',
            extensions: ['zip']
          }]
        }, (fileName) => {
          if (fileName === undefined) {
            console.log('File not saved')
            return
          }
          animesub.download(id, sh, fileName)
            .then(log => {
              console.log(log)
              this.info = true
              this.alertType = 'success'
              this.alertIcon = 'check_circle'
              this.alertMsg = 'Plik pobrano pomyślnie!'
            })
            .catch(err => {
              console.log(err)
              this.info = false
              this.alertType = 'error'
              this.alertIcon = 'warning'
              this.alertMsg = 'Błąd pobierania!'
            })
          console.log(`id ${id} sh ${sh}`)
        })
      },
      malInfo (name) {
        mal.getInfoFromName(name)
          .then((data) => {
            console.log(data)
            this.mal.title = data.title
            this.mal.picture = data.picture
            this.mal.synopsis = data.synopsis
            this.mal.aired = data.aired
            this.mal.episodes = data.episodes
          }).catch((err) => console.log(err))
      }
    }
  }
</script>

<style scoped>

</style>