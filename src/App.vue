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
    <v-footer fixed height="auto" class="footer">
      <v-spacer></v-spacer>
      &copy;{{ new Date().getFullYear() }} —
      <v-tooltip top color="secondary">
        <a @click="$electron.shell.openExternal('https://github.com/xdk78')" slot="activator" class="mx-1">xdk78</a>
        <span>Strona autora</span>
      </v-tooltip>
      <v-tooltip top color="secondary">
        <v-btn fab small class="elevation-0 ma-0" slot="activator" @click="$electron.shell.openExternal('https://github.com/Nimebox/ansi-downloader/issues/new')">
          <v-icon color="primary">bug_report</v-icon>
        </v-btn>
        <span>Zgłoś błąd</span>
      </v-tooltip>
      <v-tooltip top color="secondary">
        <v-btn fab small class="elevation-0 ma-0" slot="activator" @click="$electron.shell.openExternal('https://discord.gg/CmsVk5D')">
          <img src="./assets/discord_ico.svg" class="discord">
        </v-btn>
        <span>Serwer Discord</span>
      </v-tooltip>
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
body {
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  border-left: 1px solid rgba(0, 0, 0, 0.5);
}
.main-container {
  max-height: calc(100vh - 9vh);
  overflow-y: auto;
  overflow-x: auto;
}
.discord {
  width: 24px;
  height: 24px;
}
.footer {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  border-left: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
