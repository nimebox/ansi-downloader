<template>
  <v-system-bar app window class="windowBar">
    <v-subheader>ANSI DOWNLOADER</v-subheader>
    <v-spacer/>
    <v-btn small flat class="btns" @click="minimize">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn small flat class="btns" @click="maximize">
      <v-icon>crop_square</v-icon>
    </v-btn>
    <v-btn small flat class="btns" :ripple="{ class: 'red--text' }" @click="close">
      <v-icon>close</v-icon>
    </v-btn>
  </v-system-bar>
</template>

<script>
export default {
  name: 'systembar',
  data () {
    return {
      exitColor: 'red'
    }
  },
  methods: {
    minimize () {
      const window = this.$electron.remote.BrowserWindow.getFocusedWindow()
      window.minimize()
    },
    maximize () {
      const window = this.$electron.remote.BrowserWindow.getFocusedWindow()
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    },
    close () {
      const window = this.$electron.remote.BrowserWindow.getFocusedWindow()
      window.close()
    }
  }
}
</script>

<style scoped>
.windowBar {
  -webkit-app-region: drag;
  border-top: 1px solid rgba(0, 0, 0, 0.5) !important;
  border-right: 1px solid rgba(0, 0, 0, 0.5) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.5) !important;
}

.btns {
  -webkit-app-region: no-drag;
}
</style>
