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
        <a @click="$electron.shell.openExternal('https://github.com/xdk78')">xdk78</a>
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
</style>
