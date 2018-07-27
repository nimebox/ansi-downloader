<template>
  <v-system-bar app fixed window dark class="windowBar">
    <v-subheader>ANSI DOWNLOADER</v-subheader>
    <v-spacer/>
    <v-btn small flat class="btns" @click="minimize">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn small flat class="btns" @click="maximize">
      <v-icon>check_box_outline_blank</v-icon>
    </v-btn>
    <v-btn small flat class="btns" @click="close">
      <v-icon>close</v-icon>
    </v-btn>
  </v-system-bar>
</template>

<script>
export default {
  name: 'systembar',
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
}

.btns {
  -webkit-app-region: no-drag;
}
</style>
