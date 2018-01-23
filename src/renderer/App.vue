<template>
  <v-app>
    <v-system-bar fixed window dark class="windowBar">
      <div>ANSI DOWNLOADER</div>
      <v-spacer></v-spacer>
      <v-btn small flat @click="minimize" class="btns">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-btn small flat @click="maximize" class="btns">
        <v-icon>check_box_outline_blank</v-icon>
      </v-btn>
      <v-btn small flat @click="close" class="btns">
        <v-icon>close</v-icon>
      </v-btn>
    </v-system-bar>
    <main>
      <v-container fluid style="max-height: 700px" class="scroll-y">
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </main>
    <v-footer fixed>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'ansi-downloader',
    data () {
      return {}
    },
    methods: {
      minimize () {
        let window = this.$electron.remote.BrowserWindow.getFocusedWindow()
        window.minimize()
      },
      maximize () {
        let window = this.$electron.remote.BrowserWindow.getFocusedWindow()
        if (window.isMaximized()) {
          window.unmaximize()
        } else {
          window.maximize()
        }
      },
      close () {
        let window = this.$electron.remote.BrowserWindow.getFocusedWindow()
        window.close()
      }
    }
  }
</script>

<style lang="stylus">
    @import './stylus/main.styl'
    html { overflow-y: hidden }
    .windowBar {
      -webkit-app-region: drag
    }
    .btns {
      -webkit-app-region: no-drag
    }
    // ::-webkit-scrollbar {
    //     width: 15px !important
    //     height: 10px !important
    //     background: #424242 !important
    //     border: 1px solid #252525 !important
    // }
    // ::-webkit-scrollbar-button {
    //     display: none !important
    // }
    // ::-webkit-scrollbar-thumb,
    // ::-webkit-scrollbar-track {
    //     border: 0 !important
    //     box-shadow: none !important
    // }
    // ::-webkit-scrollbar-thumb {
    //     min-height: 28px !important
    //     background: #333 !important
    // }
    // ::-webkit-scrollbar-corner,
    // ::-webkit-scrollbar-track {
    //     background: #212121 !important
    // }
</style>