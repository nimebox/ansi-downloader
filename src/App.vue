<template>
  <v-app>
    <systembar/>
    <v-content>
      <v-container fluid class="main-container">
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-footer fixed>
      <v-spacer></v-spacer>
      <v-card flat class="footer">&copy;{{ new Date().getFullYear() }} —
        <v-tooltip top>
          <a @click="$electron.shell.openExternal('https://github.com/xdk78')" slot="activator">xdk78</a>
          <span>Strona autora</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn fab small class="elevation-0" slot="activator" @click="$electron.shell.openExternal('https://github.com/Nimebox/ansi-downloader/issues/new')">
            <v-icon color="primary">bug_report</v-icon>
          </v-btn>
          <span>Zgłoś błąd</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn fab small class="elevation-0 mx-0 px-0" slot="activator" @click="$electron.shell.openExternal('https://discord.gg/CmsVk5D')">
            <img src="./assets/discord_ico.svg" class="discord">
          </v-btn>
          <span>Serwer Discord</span>
        </v-tooltip>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Systembar from '@/components/Systembar.vue'
export default {
  name: 'ansi-downloader',
  components: { Systembar }
}
</script>

<style>
html,
body {
  overflow: hidden !important;
}
.main-container {
  max-height: calc(100vh - 10vh);
  overflow-y: auto;
  overflow-x: auto;
}
.footer {
  padding: 14px;
}
.discord {
  width: 24px;
  height: 24px;
}
</style>
